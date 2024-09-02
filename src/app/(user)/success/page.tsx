import CustomDialog from "@/components/custom/CustomDialog";
import { Button } from "@/components/ui/button";
import { sleep } from "@/lib/utils";
import React from "react";

export default async function page() {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
      <div className="flex flex-col items-center py-8 min-w-[600px] rounded-xl bg-white">
        <div className="flex flex-col justify-center items-center pb-6">
          <h2 className="font-semibold text-2xl py-2">Booking Successfull!</h2>
          <p className="text-muted-foreground max-w-[380px] mx-auto text-center">
            Thankyou for booking, your booking has been completed successfully
          </p>
        </div>
        <CustomDialog ButtonLabel="View details" ButtonClassName="" />
      </div>
    </div>
  );
}
