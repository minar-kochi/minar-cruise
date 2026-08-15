"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * The three states `minNewBookingCount` can be in. The database encodes these
 * as null / 0 / n; the operator only ever sees these three choices.
 */
type MinGuestsMode = "default" | "none" | "custom";

/** Small radio row — shadcn has no RadioGroup in this project. */
function Choice({
  name,
  checked,
  onSelect,
  label,
  children,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="size-4 accent-primary"
      />
      <span className="text-sm">{label}</span>
      {children}
    </label>
  );
}

export default function PackageSettingsForm({
  packageId,
}: {
  packageId: string;
}) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.packages.getPackageContent.useQuery({
    id: packageId,
  });

  const [useDefaultLeadTime, setUseDefaultLeadTime] = useState(true);
  const [leadTime, setLeadTime] = useState<string>("");
  const [minGuestsMode, setMinGuestsMode] = useState<MinGuestsMode>("default");
  const [minGuests, setMinGuests] = useState<string>("");
  const [isBookableOnline, setIsBookableOnline] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    setUseDefaultLeadTime(data.minLeadTimeHours === null);
    setLeadTime(
      String(data.minLeadTimeHours ?? data.defaults.defaultMinLeadTimeHours),
    );
    setMinGuestsMode(
      data.minNewBookingCount === null
        ? "default"
        : data.minNewBookingCount === 0
          ? "none"
          : "custom",
    );
    setMinGuests(
      String(
        data.minNewBookingCount && data.minNewBookingCount > 0
          ? data.minNewBookingCount
          : data.defaults.defaultMinNewBookingCount,
      ),
    );
    setIsBookableOnline(data.isBookableOnline);
    setIsVisible(data.isVisible);
  }, [data]);

  const { mutate: save, isPending } =
    trpc.admin.packages.updatePackageSettings.useMutation({
      onError(err) {
        toast.error(err.message, { duration: 6000 });
      },
      async onSuccess() {
        toast.success("Package settings updated — public pages revalidated");
        await utils.admin.packages.getPackageContent.invalidate({
          id: packageId,
        });
      },
    });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const defaults = data.defaults;

  function handleSave() {
    setError(null);

    let leadTimeValue: number | null = null;
    if (!useDefaultLeadTime) {
      const parsed = Number(leadTime);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setError("Booking closes must be a number of hours, 0 or more.");
        return;
      }
      leadTimeValue = parsed;
    }

    let minGuestsValue: number | null = null;
    if (minGuestsMode === "none") {
      // 0 is the sentinel for "no minimum"; null would mean "use the default".
      minGuestsValue = 0;
    } else if (minGuestsMode === "custom") {
      const parsed = Number(minGuests);
      if (!Number.isInteger(parsed) || parsed < 1) {
        setError("Minimum guests must be a whole number of 1 or more.");
        return;
      }
      minGuestsValue = parsed;
    }

    save({
      id: packageId,
      minLeadTimeHours: leadTimeValue,
      minNewBookingCount: minGuestsValue,
      isBookableOnline,
      isVisible,
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking rules</CardTitle>
          <CardDescription>
            These apply to this package only. Anything left on{" "}
            <span className="font-medium">Use default</span> follows{" "}
            <span className="font-medium">Boat &amp; booking limits</span> in
            Settings, and moves whenever that default changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Booking closes</Label>
            <p className="mb-2 mt-1 text-xs text-muted-foreground">
              How long before departure this cruise stops accepting bookings.
            </p>
            <div className="space-y-2">
              <Choice
                name="leadTime"
                label={`Use default (${defaults.defaultMinLeadTimeHours} hours before)`}
                checked={useDefaultLeadTime}
                onSelect={() => setUseDefaultLeadTime(true)}
              />
              <Choice
                name="leadTime"
                label="Custom"
                checked={!useDefaultLeadTime}
                onSelect={() => setUseDefaultLeadTime(false)}
              >
                <span className="ml-auto flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.5"
                    value={leadTime}
                    disabled={useDefaultLeadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    hours before
                  </span>
                </span>
              </Choice>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Minimum guests</Label>
            <p className="mb-2 mt-1 text-xs text-muted-foreground">
              Only applies when a customer opens a brand-new sailing on a date
              with no schedule yet.
            </p>
            <div className="space-y-2">
              <Choice
                name="minGuests"
                label={`Use default (${defaults.defaultMinNewBookingCount} guests)`}
                checked={minGuestsMode === "default"}
                onSelect={() => setMinGuestsMode("default")}
              />
              <Choice
                name="minGuests"
                label="No minimum — sails with any party size"
                checked={minGuestsMode === "none"}
                onSelect={() => setMinGuestsMode("none")}
              />
              <Choice
                name="minGuests"
                label="Custom"
                checked={minGuestsMode === "custom"}
                onSelect={() => setMinGuestsMode("custom")}
              >
                <span className="ml-auto flex items-center gap-2">
                  <Input
                    type="number"
                    value={minGuests}
                    disabled={minGuestsMode !== "custom"}
                    onChange={(e) => setMinGuests(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">guests</span>
                </span>
              </Choice>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Checkbox
              id="isVisible"
              checked={isVisible}
              onCheckedChange={(checked) => setIsVisible(checked === true)}
            />
            <div>
              <Label htmlFor="isVisible" className="font-normal">
                Show this package on the public site
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Unticking removes it from the home carousel, search and the nav
                menu, and its page returns 404. Booking links already issued
                keep working.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Checkbox
              id="isBookableOnline"
              checked={isBookableOnline}
              onCheckedChange={(checked) =>
                setIsBookableOnline(checked === true)
              }
            />
            <div>
              <Label htmlFor="isBookableOnline" className="font-normal">
                Bookable online
              </Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Unticking keeps the package listed but stops online booking —
                use it for enquiry-only cruises.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p
        className={cn("min-h-5 text-sm text-red-500", { hidden: !error })}
        role="alert"
      >
        {error}
      </p>

      <Button
        type="button"
        className="w-full"
        disabled={isPending}
        onClick={handleSave}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Saving
          </>
        ) : (
          "Save settings"
        )}
      </Button>
    </div>
  );
}
