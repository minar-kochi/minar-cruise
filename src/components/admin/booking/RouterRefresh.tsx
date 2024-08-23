"use client";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function RouterRefreshButton() {
  const router = useRouter();
  return (
    <Button variant={"ghost"} onClick={() => router.refresh()}>
      <div className="flex gap-2">
        <RefreshCcw />
        {/* Refresh */}
      </div>
    </Button>
  );
}
