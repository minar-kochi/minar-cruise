import Link from "next/link";
import {
  Home,
  LineChart,
  Menu,
  Package,
  ShipIcon,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import OpenScheduleButton from "../dashboard/Schedule/OpenScheduleButton";
import HeaderAdminDropDownMenu from "./HeaderAdminDropDownMenu";
import { ModeToggle } from "./theme-changer";
import ViewSelectedDate from "../dashboard/home/ViewSelectedDate";
import NavigationSelectionState from "./NavigationSelectionState";
import RouterRefreshButton from "../booking/RouterRefresh";

const HeaderDeprecated = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <header className="flex h-14 bg-background  top-0 sticky items-center gap-4 border-b  px-4 lg:h-[60px] lg:px-6 ">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              {/* <span className="sr-only">Toggle navigation menu</span> */}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium peer">
              <SheetClose asChild>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 text-lg font-semibold"
                >
                  <ShipIcon className="h-6 w-6" />
                  <span className="  text-xl">Minar Cruise</span>
                </Link>
              </SheetClose>
              <NavigationSelectionState routeName="admin">
                <SheetClose asChild>
                  <Link
                    href="/admin"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary"
                  >
                    <Home className="h-5 w-5" />
                    Dashboard
                  </Link>
                </SheetClose>
              </NavigationSelectionState>
              <NavigationSelectionState routeName="schedule">
                <SheetClose asChild>
                  <Link
                    href="/admin/schedule"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary "
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Schedule
                  </Link>
                </SheetClose>
              </NavigationSelectionState>
              <NavigationSelectionState routeName="booking">
                <SheetClose asChild>
                  <Link
                    href="/admin/booking"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary "
                  >
                    <Package className="h-5 w-5" />
                    Booking
                  </Link>
                </SheetClose>
              </NavigationSelectionState>
              <NavigationSelectionState routeName="image-uploader">
                <SheetClose asChild>
                  <Link
                    href="/admin/image-uploader"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary "
                  >
                    <Users className="h-5 w-5" />
                    Upload Image
                  </Link>
                </SheetClose>
              </NavigationSelectionState>
              <NavigationSelectionState routeName="createBlog">
                <SheetClose asChild>
                  <Link
                    href="/admin/createBlog"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary "
                  >
                    <LineChart className="h-5 w-5" />
                    Create Blog
                  </Link>
                </SheetClose>
              </NavigationSelectionState>
              <NavigationSelectionState routeName="cruise-packages">
                <SheetClose asChild>
                  <Link
                    href="/admin/cruise-packages"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-primary "
                  >
                    <LineChart className="h-5 w-5" />
                    View Package&apos;s
                  </Link>
                </SheetClose>
              </NavigationSelectionState>
            </nav>
            <div className="mt-auto"></div>
          </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
          <ViewSelectedDate />
        </div>
        <div className="flex items-center gap-2">
          <OpenScheduleButton />
          <RouterRefreshButton />
          <ModeToggle />
          <HeaderAdminDropDownMenu />
        </div>
      </header>
      {children}
    </div>
  );
};

export default HeaderDeprecated;
