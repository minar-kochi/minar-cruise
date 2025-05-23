"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import OpenScheduleButton from "../dashboard/Schedule/OpenScheduleButton";
import { sideBarData } from "./navigation-details";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logo: Logo } = sideBarData.teams[0];
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={cn("flex flex-row gap-2 ", {
          "p-5": state !== "collapsed",
        })}
      >
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground ">
          <Logo className="size-4" />
        </div>

        <div
          className={cn(
            "flex text-left   items-center justify-center font-bold text-2xl",
            {
              hidden: state === "collapsed",
            },
          )}
        >
          {sideBarData.teams[0].name}
          {/* <span className="truncate text-xs">{sideBarData.teams[0].plan}</span> */}
        </div>
        {/* <TeamSwitcher teams={sideBarData.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sideBarData.navMain} />
        {/* <NavProjects projects={projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <div className="">
          <OpenScheduleButton />
        </div>
        {/* <NavUser user={sideBarData.user} /> */}
        {/* <LogoutButton/> */}
        <Button
          onClick={() => {
            toast.success("See you back soon!");
            signOut({ redirect: true, callbackUrl: "/" });
          }}
        >
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
