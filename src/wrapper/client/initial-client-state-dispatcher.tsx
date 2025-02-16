import { getPackageSearchItems } from "@/db/data/dto/package";
import StoreProvider from "@/providers/client/ClientStoreProvider";
import { ReactNode } from "react";

export default async function InitialClientStateDispatcher({
  children,
}: {
  children: ReactNode;
}) {
  const packages = await getPackageSearchItems();

  return <StoreProvider packages={packages}>{children}</StoreProvider>;
}
