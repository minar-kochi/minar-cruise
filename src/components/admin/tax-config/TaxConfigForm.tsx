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
import { cn } from "@/lib/utils";
import {
  TaxConfigValidator,
  TTaxConfigValidator,
} from "@/lib/validators/TaxConfigValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function TaxConfigForm() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.taxConfig.getTaxConfig.useQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TTaxConfigValidator>({
    resolver: zodResolver(TaxConfigValidator),
    defaultValues: {
      gstRate: 0,
      sacCode: "",
      gstin: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        gstRate: data.gstRate,
        sacCode: data.sacCode,
        gstin: data.gstin,
      });
    }
  }, [data, reset]);

  const { mutate: updateTaxConfig } =
    trpc.admin.taxConfig.updateTaxConfig.useMutation({
      onMutate() {
        toast.loading("Updating tax configuration");
      },
      onError(error) {
        toast.dismiss();
        toast.error(error.message);
      },
      async onSuccess() {
        toast.dismiss();
        toast.success("Tax configuration updated");
        await utils.admin.taxConfig.getTaxConfig.invalidate();
        await utils.admin.taxConfig.getPublicTaxConfig.invalidate();
      },
    });

  const onSubmit = (values: TTaxConfigValidator) => {
    updateTaxConfig(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Tax Configuration</CardTitle>
        <CardDescription>
          GST values applied to new bookings. Existing bookings keep the rate
          they were charged at.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="gstRate">GST Rate (%)</Label>
            <Input
              id="gstRate"
              type="number"
              step="0.01"
              className="mt-1.5"
              {...register("gstRate", { valueAsNumber: true })}
            />
            <p
              className={cn("min-h-4 text-sm text-red-500 mt-1", {
                hidden: !errors.gstRate,
              })}
            >
              {errors.gstRate?.message}
            </p>
          </div>

          <div>
            <Label htmlFor="sacCode">SAC Code</Label>
            <Input
              id="sacCode"
              className="mt-1.5"
              placeholder="998555"
              {...register("sacCode")}
            />
            <p
              className={cn("min-h-4 text-sm text-red-500 mt-1", {
                hidden: !errors.sacCode,
              })}
            >
              {errors.sacCode?.message}
            </p>
          </div>

          <div>
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              className="mt-1.5 uppercase"
              placeholder="32BSTPK7128K2Z8"
              {...register("gstin", {
                setValueAs: (v) =>
                  typeof v === "string" ? v.toUpperCase() : v,
              })}
            />
            <p
              className={cn("min-h-4 text-sm text-red-500 mt-1", {
                hidden: !errors.gstin,
              })}
            >
              {errors.gstin?.message}
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving
              </>
            ) : (
              "Save Configuration"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
