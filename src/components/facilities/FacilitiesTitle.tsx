import React from "react";

export default function FacilitiesTitle({
  title,
  author,
}: {
  title?: string;
  author?: string;
}) {
  return (
    <div className="absolute top-1/2 left-1/4">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      <h2 className="text-lga font-medium text-gray-200">{author}</h2>
    </div>
  );
}
