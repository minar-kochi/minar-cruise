"use client";
import { Button } from "@/components/ui/button";
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
    <Button
      variant={"secondary"}
      onClick={() => {
        dispatch(setIsModalToggle());
      }}
      className="w-full"
    >
      {title ? title : "Manage Schedule"}
    </Button>
  );
}
