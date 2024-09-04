import React from "react";

export default function HeaderTitleDescription({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="flex justify-center  flex-col items-center gap-2 my-6">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="max-w-prose text-center text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
