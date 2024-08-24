import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import Refunds from "@/data/mdx/refund-terms.mdx";
import React from "react";

export default async function RefundReturns() {
  return (
    <div>
      <FacilitiesImageCard label="Refunds" />
      <Bounded className="prose my-12">
        <Refunds />
      </Bounded>
    </div>
  );
}
