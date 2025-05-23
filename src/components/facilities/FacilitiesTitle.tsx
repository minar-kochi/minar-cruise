import React from "react";
import Bounded from "../elements/Bounded";

export default function FacilitiesTitle({
  title,
  author,
}: {
  title?: string;
  author?: string;
}) {
  return (
    <div className="absolute top-0 left-0 w-full h-full ">
      <Bounded className="relative top-1/2">
        <h1 className="text-4xl font-bold text-white">{title}</h1>
        <h2 className="text-lga font-medium text-gray-200">{author}</h2>
      </Bounded>
    </div>
  );
}
