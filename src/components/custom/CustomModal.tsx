"use client";
import {
  useCallback,
  useRef,
  useEffect,
  MouseEventHandler,
  ElementRef,
} from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function CustomModal({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Hello");
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <div className="modal-backdrop">
      <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
        {children}
        <button onClick={onDismiss} className="close-button" />
      </dialog>
    </div>,
    document.getElementById("modal-root")!,
  );
}
