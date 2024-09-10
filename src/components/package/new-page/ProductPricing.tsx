"use client";
import { useCookieStore } from "@/providers/cookie-provider";
import { RegionalPrice } from "@/Type/Common";
import React from "react";

const ProductPricing = ({
  RegionalData,
}: {
  RegionalData: { AED: RegionalPrice; INR: RegionalPrice };
}) => {
  const region = useCookieStore((state) => state.region);
  const { comparePrice, price, priceId, region: Region } = RegionalData[region];
  return (
    <div className="mt-1 flex items-center gap-2">
      <p className="text-lg font-medium">
        {Region} {price}
      </p>
      <p className="text-sm font-medium text-red-400 line-through">
        {region} {comparePrice}
      </p>
    </div>
  );
};

export default ProductPricing;
