import { Button } from "@/components/ui/button";
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  SquarePen,
  ImageUp,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import NavigationSelectionState from "./NavigationSelectionState";

const MenuBar = () => {
  return (
    <div className="hidden border-r  bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Minar Cruise</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1  ">
          <nav className="grid items-start px-2 text-sm font-medium gap-y-1 lg:px-4">
            <NavigationSelectionState routeName="admin">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted  hover:border-2 hover:border-muted hover:rounded-md hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </NavigationSelectionState>
            <NavigationSelectionState routeName="schedule">
              <Link
                href="/admin/schedule"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted  hover:border-2 hover:border-muted hover:rounded-md hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Schedule
              </Link>
            </NavigationSelectionState>
            <NavigationSelectionState routeName="booking">
              <Link
                href="/admin/booking"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted  hover:border-2 hover:border-muted hover:rounded-md hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Booking
              </Link>
            </NavigationSelectionState>
            <NavigationSelectionState routeName="image-uploader">
              <Link
                href="/admin/image-uploader"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted  hover:border-2 hover:border-muted hover:rounded-md hover:text-primary"
              >
                <ImageUp className="h-4 w-4" />
                Upload Image
              </Link>
            </NavigationSelectionState>
            <NavigationSelectionState routeName="createBlog">
              <Link
                href="/admin/createBlog"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted  hover:border-2 hover:border-muted hover:rounded-md hover:text-primary"
              >
                <SquarePen className="h-4 w-4" />
                Create Blog
              </Link>
            </NavigationSelectionState>
            <NavigationSelectionState routeName="cruise-packages">
              <Link
                href="/admin/cruise-packages"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted  hover:border-2 hover:border-muted hover:rounded-md hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                View Package&apos;s
              </Link>
            </NavigationSelectionState>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
