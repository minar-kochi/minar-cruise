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
} from "@/components/ui/sidebar";
import OpenScheduleButton from "../dashboard/Schedule/OpenScheduleButton";
import { sideBarData } from "./navigation-details";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sideBarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sideBarData.navMain} />
        {/* <NavProjects projects={projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <div className="">
          <OpenScheduleButton />
        </div>
        <NavUser user={sideBarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
