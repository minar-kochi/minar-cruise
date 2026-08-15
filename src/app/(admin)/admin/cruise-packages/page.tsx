import { db } from "@/db";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export default async function CruisePackage() {
  const data = await db.package.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      duration: true,
      packageCategory: true,
      packageType: true,
      isVisible: true,
    },
    orderBy: {
      packageCategory: "asc",
    },
  });
  return (
    <main>
      <div>
        <HeaderTitleDescription
          title="Packages"
          description="Edit a package's copy, prices, amenities and images, or hide it from the public site."
        />
      </div>
      <div className="border bg-sidebar m-2 p-2 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className=" bg-muted-foreground/10">
              {/* <TableHead>id</TableHead> */}
              <TableHead className="max-sm:text-[9px]">ID</TableHead>
              <TableHead className="max-sm:text-[9px]">Title</TableHead>
              <TableHead className="max-sm:text-[9px]">
                Package Category
              </TableHead>
              <TableHead className="max-sm:text-[9px]">Package Type</TableHead>
              <TableHead className="max-sm:text-[9px]">Visibility</TableHead>
              <TableHead className="max-sm:text-[9px]">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              return (
                <TableRow className="relative" key={`${item.id}-table-row`}>
                  <TableCell className="max-w-[100px]  min-w-[100px] max-sm:text-[9px] ">
                    #{item.id.slice(9, -1)}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] max-sm:text-pretty">
                    {item.title}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] max-sm:text-left">
                    {item.packageType}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] max-sm:text-pretty">
                    {item.packageCategory.toLocaleLowerCase()}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] max-sm:text-pretty">
                    <Badge variant={item.isVisible ? "default" : "secondary"}>
                      {item.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] max-sm:text-pretty">
                    <Link
                      className={buttonVariants({ variant: "outline" })}
                      href={`/admin/cruise-packages/${item.id}`}
                    >
                      Edit package
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
