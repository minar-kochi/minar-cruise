"use client";
import { setIsModalOpen } from "@/lib/features/modal/modalSlice";
import { AppStore, makeStore } from "@/lib/store/adminStore";
import React, { useRef } from "react";
import { Provider } from "react-redux";

export default function ModalStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
