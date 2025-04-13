"use client";
import { TGetPackageSearchItems } from "@/db/data/dto/package";
import { setSearchPackages } from "@/lib/features/client/packageClientSlice";
import { ClientAppStore, makeClientStore } from "@/lib/store/clientStore";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";

export default function ClientStoreProvider({
  children,
  packages,
}: {
  children: ReactNode;
  packages: TGetPackageSearchItems | null;
}) {
  const storeRef = useRef<ClientAppStore>();
  if (!storeRef.current) {
    storeRef.current = makeClientStore();
    storeRef.current.dispatch(setSearchPackages(packages));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
