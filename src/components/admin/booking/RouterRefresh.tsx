"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function RouterRefreshButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  return (
    <Button
      variant={"ghost"}
      className={cn("", className)}
      onClick={() => router.refresh()}
    >
      <div className="flex gap-2">
        <RefreshCcw />
        {/* Refresh */}
      </div>
    </Button>
  );
}
