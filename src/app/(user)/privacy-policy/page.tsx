import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import PrivacyPolicyMdx from "@/data/mdx/privacy-policy.mdx";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
import React from "react";

export const metadata = constructMetadata({
  title: "Privacy Policy | Minar Cruise",
  noIndex: true,
});

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
