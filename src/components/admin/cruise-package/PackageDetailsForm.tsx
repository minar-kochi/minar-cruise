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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatPrice } from "@/lib/utils";
import {
  PackageDetailsValidator,
  TPackageDetailsValidator,
} from "@/lib/validators/PackageContentValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function PackageDetailsForm({
  packageId,
}: {
  packageId: string;
}) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.packages.getPackageContent.useQuery({
    id: packageId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TPackageDetailsValidator>({
    resolver: zodResolver(PackageDetailsValidator),
    defaultValues: {
      id: packageId,
      title: "",
      description: "",
      packageType: "normal",
      adultPrice: 0,
      childPrice: 0,
      duration: 120,
      fromTime: "",
      toTime: "",
    },
  });

  useEffect(() => {
    if (!data) return;
    reset({
      id: data.id,
      title: data.title,
      description: data.description,
      packageType: data.packageType,
      // Stored in paise, edited in rupees.
      adultPrice: formatPrice(data.adultPrice),
      childPrice: formatPrice(data.childPrice),
      duration: data.duration,
    });
  }, [data, reset]);

  const { mutate: updateDetails, isPending } =
    trpc.admin.packages.updatePackageDetails.useMutation({
      onError(error) {
        toast.error(error.message, { duration: 6000 });
      },
      async onSuccess() {
        toast.success("Package updated — public pages revalidated");
        await utils.admin.packages.getPackageContent.invalidate({
          id: packageId,
        });
      },
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <form
      className="mx-auto max-w-2xl"
      onSubmit={handleSubmit(
        (values) => updateDetails(values),
        (formErrors: FieldErrors<TPackageDetailsValidator>) => {
          const first = Object.values(formErrors).find(
            (e): e is FieldError => typeof e?.message === "string",
          )?.message;
          toast.error(first ?? "Please check the highlighted fields.", {
            duration: 5000,
          });
        },
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Package details</CardTitle>
          <CardDescription>
            Shown on the package page, the home carousel and search results.
            Booking rules and visibility live on the Settings tab. Saving
            refreshes the public pages straight away.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <input type="hidden" {...register("id")} />

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" className="mt-1.5" {...register("title")} />
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.title,
              })}
            >
              {errors.title?.message}
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={6}
              className="mt-1.5"
              {...register("description")}
            />
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.description,
              })}
            >
              {errors.description?.message}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="adultPrice">Adult price (₹)</Label>
              <Input
                id="adultPrice"
                type="number"
                step="0.01"
                className="mt-1.5"
                {...register("adultPrice", { valueAsNumber: true })}
              />
              <p
                className={cn("mt-1 min-h-4 text-sm text-red-500", {
                  hidden: !errors.adultPrice,
                })}
              >
                {errors.adultPrice?.message}
              </p>
            </div>

            <div>
              <Label htmlFor="childPrice">Child price (₹)</Label>
              <Input
                id="childPrice"
                type="number"
                step="0.01"
                className="mt-1.5"
                {...register("childPrice", { valueAsNumber: true })}
              />
              <p
                className={cn("mt-1 min-h-4 text-sm text-red-500", {
                  hidden: !errors.childPrice,
                })}
              >
                {errors.childPrice?.message}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="fromTime">Departs</Label>
              <Input
                id="fromTime"
                placeholder="6:30:AM"
                className="mt-1.5"
                {...register("fromTime")}
              />
              <p
                className={cn("mt-1 min-h-4 text-sm text-red-500", {
                  hidden: !errors.fromTime,
                })}
              >
                {errors.fromTime?.message}
              </p>
            </div>

            <div>
              <Label htmlFor="toTime">Returns</Label>
              <Input
                id="toTime"
                placeholder="8:30:AM"
                className="mt-1.5"
                {...register("toTime")}
              />
              <p
                className={cn("mt-1 min-h-4 text-sm text-red-500", {
                  hidden: !errors.toTime,
                })}
              >
                {errors.toTime?.message}
              </p>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                step="15"
                placeholder="120"
                className="mt-1.5"
                {...register("duration", { valueAsNumber: true })}
              />
              <p
                className={cn("mt-1 min-h-4 text-sm text-red-500", {
                  hidden: !errors.duration,
                })}
              >
                {errors.duration?.message}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="packageType">Package type</Label>
            <Input
              id="packageType"
              className="mt-1.5"
              {...register("packageType")}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Only packages of type <code>normal</code> appear in the home
              carousel.
            </p>
            <p
              className={cn("mt-1 min-h-4 text-sm text-red-500", {
                hidden: !errors.packageType,
              })}
            >
              {errors.packageType?.message}
            </p>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving
              </>
            ) : (
              "Save package details"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
