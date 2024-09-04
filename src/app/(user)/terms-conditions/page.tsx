import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import TermsAndConditions from "@/data/mdx/terms-condition.mdx";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
import React from "react";

export const metadata = constructMetadata({
  title: "Privacy Policy | Minar Cruise",
  noIndex: true,
});



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
