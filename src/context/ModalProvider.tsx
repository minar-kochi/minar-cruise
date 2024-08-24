"use client";
import { createContext, ReactNode, useState } from "react";

type TModalContext = {
  isScheduleSheetOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};
export const ModalContext = createContext<TModalContext>({
  isScheduleSheetOpen: false,
  setIsModalOpen: () => {},
});

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isScheduleSheetOpen, setIsModalOpen] = useState(false);
  return (
    <ModalContext.Provider
      value={{
        isScheduleSheetOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
