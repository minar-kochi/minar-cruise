"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type ElementRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function Modal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  //   const dialogRef = useRef<ElementRef<"AlertDialogTrigger">>(null);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          onDismiss();
        }
        setIsOpen(value);
      }}
    >
      <DialogContent className={cn("", className)}>{children}</DialogContent>
      {/* <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
        {children}
        <button onClick={onDismiss} className="close-button" />
      </dialog> */}
    </Dialog>,
    document.getElementById("modal-root")!,
  );
}
