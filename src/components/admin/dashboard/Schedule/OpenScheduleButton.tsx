"use client";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ModalContext } from "@/context/ModalProvider";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import {
  setIsModalOpen,
  setIsModalToggle,
} from "@/lib/features/modal/modalSlice";
import { selectModal } from "@/lib/features/schedule/selector";
import React, { useContext } from "react";
import toast from "react-hot-toast";

export default function OpenScheduleButton({ title }: { title?: string }) {
  const dispatch = useAppDispatch();
  return (
    <SidebarMenuButton
      onClick={() => {
        dispatch(setIsModalToggle());
      }}
      className="w-full font-bold py-6 bg-muted hover:bg-muted/50"
    >
      {title ? title : <p className="text-center mx-auto">Manage Schedule</p>}
    </SidebarMenuButton>
  );
}
