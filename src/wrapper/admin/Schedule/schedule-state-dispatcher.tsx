"use client";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import React, { ReactNode } from "react";

export default function ScheduleStateDispatcher({
  Packages,
  children,
}: {
  children: ReactNode;
  Packages: TExcludedOrganizedPackageData;
}) {
  return <div>{children}</div>;
}
