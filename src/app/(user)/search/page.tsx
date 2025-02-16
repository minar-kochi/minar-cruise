import { cachedSearchPackage } from "@/db/data/dto/package";
import React from "react";
import { z } from "zod";
import SearchPageWrapper from "./search-page-wrapper";
type TSearchPage = {
  searchParams: {
    selected?: string | undefined;
  };
};
const isCuid = z.string().cuid().array();

export default async function SearchPage(reqParam: TSearchPage) {
  const { success, data, error } = isCuid.safeParse(
    JSON.parse(reqParam?.searchParams?.selected ?? "[]"),
  );

  return (
    <main className="min-h-[calc(100vh-20rem)]">
      <SearchPageWrapper selected={data}  />
    </main>
  );
}
