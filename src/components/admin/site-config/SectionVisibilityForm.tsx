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
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Section = { key: string; label: string; isVisible: boolean };

export default function SectionVisibilityForm() {
  const utils = trpc.useUtils();
  const { data, isLoading } =
    trpc.admin.siteConfig.getSectionVisibility.useQuery();

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (data) setSections(data);
  }, [data]);

  const { mutate: save, isPending } =
    trpc.admin.siteConfig.updateSectionVisibility.useMutation({
      onError(error) {
        toast.error(error.message, { duration: 6000 });
      },
      async onSuccess() {
        toast.success("Visibility updated — pages revalidated");
        await utils.admin.siteConfig.getSectionVisibility.invalidate();
      },
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const navSections = sections.filter((s) => s.key.startsWith("nav."));
  const pageSections = sections.filter((s) => s.key.startsWith("page."));

  function toggle(key: string, isVisible: boolean) {
    setSections((current) =>
      current.map((s) => (s.key === key ? { ...s, isVisible } : s)),
    );
  }

  function renderGroup(group: Section[]) {
    return (
      <div className="space-y-3">
        {group.map((section) => (
          <div
            key={section.key}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <Checkbox
              id={section.key}
              checked={section.isVisible}
              onCheckedChange={(checked) =>
                toggle(section.key, checked === true)
              }
            />
            <Label htmlFor={section.key} className="font-normal">
              {section.label.replace(/^(Navigation|Page) — /, "")}
            </Label>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Navigation links</CardTitle>
          <CardDescription>
            Unticking removes the link from the header and mobile menu. The page
            itself stays reachable unless you also hide it below.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderGroup(navSections)}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
          <CardDescription>
            Unticking makes the page return 404, so a hidden page cannot be
            reached by typing its URL or following an old link.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderGroup(pageSections)}</CardContent>
      </Card>

      <Button
        type="button"
        className="w-full"
        disabled={isPending}
        onClick={() =>
          save({
            sections: sections.map(({ key, isVisible }) => ({
              key,
              isVisible,
            })),
          })
        }
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Saving
          </>
        ) : (
          "Save visibility"
        )}
      </Button>
    </div>
  );
}
