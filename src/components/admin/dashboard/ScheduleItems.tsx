"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

const ScheduleItems = () => {
  
  return (
    <section className="flex flex-col justify-between border w-[600px]">
      <article className="flex justify-between">
        <h2 className=" text-lg px-5">Breakfast</h2>
        <DropdownMenu>
          <DropdownMenuTrigger className="border w-[300px]">
            select
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>available</DropdownMenuItem>
            <DropdownMenuItem>blocked</DropdownMenuItem>
            <DropdownMenuItem>maintenance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </article>
      <article className="flex justify-between">
        <h2 className=" text-lg px-5">Lunch</h2>
        <DropdownMenu>
          <DropdownMenuTrigger className="border w-[300px]">
            select
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>available</DropdownMenuItem>
            <DropdownMenuItem>blocked</DropdownMenuItem>
            <DropdownMenuItem>maintenance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </article>
      <article className="flex justify-between">
        <h2 className=" text-lg px-5">Dinner</h2>
        <DropdownMenu>
          <DropdownMenuTrigger className="border w-[300px]">
            select
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>available</DropdownMenuItem>
            <DropdownMenuItem>blocked</DropdownMenuItem>
            <DropdownMenuItem>maintenance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </article>
    </section>
  );
};

export default ScheduleItems;
