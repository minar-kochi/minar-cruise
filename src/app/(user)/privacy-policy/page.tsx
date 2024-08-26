import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import PrivacyPolicyMdx from "@/data/mdx/privacy-policy.mdx";
import React from "react";

export default async function PrivacyPolicy() {
  return (
    <div>
      <FacilitiesImageCard label="Privacy Policy" />
      <Bounded className="prose my-12">
        <PrivacyPolicyMdx />
      </Bounded>
    </div>
  );
}
