import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import TermsAndConditions from "@/data/mdx/terms-condition.mdx";
import React from "react";

export default async function Terms() {
  return (
    <div>
      <FacilitiesImageCard label="Terms" />
      <Bounded className="prose my-12">
        <TermsAndConditions />
      </Bounded>
    </div>
  );
}
