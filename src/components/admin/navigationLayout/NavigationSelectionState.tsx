'use client'

import { useInitialPath } from "@/db/hooks/handlePathName";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation"
import React from "react";

interface INavigationSelectionState {
    children: React.ReactNode
    routeName: string
    className?: string
}

export default function NavigationSelectionState({ children, routeName, className }:INavigationSelectionState) {
    const pathname = usePathname();
    let parsedPath = useInitialPath({ pathName: pathname })

  return (
    <div className={cn("", className, {"bg-muted border-2 border-muted rounded-md hover:text-primary": routeName===parsedPath })}>
        {children}
    </div>
  )
}
