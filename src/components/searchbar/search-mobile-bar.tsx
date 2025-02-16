import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
export default function SearchMobileBar() {
  return (
    <Drawer>
      <DrawerTrigger className="w-full py-2 md:py-3 md:hidden ">
        <div className="flex">
          <p className="md:text-sm text-muted-foreground">Choose a package</p>
        </div>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Welcome to search bar</DrawerTitle>
          <DrawerDescription>This is search description</DrawerDescription>
        </DrawerHeader>
        welcome to the contnet
      </DrawerContent>
    </Drawer>
  );
}
