"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface IBlogPagination {
  totalNumberOfPages: number;
  currentPageNumber: number;
}
export default function BlogPagination({
  totalNumberOfPages,
  currentPageNumber,
}: IBlogPagination) {
  return (
    <Pagination className="pb-10">
      <PaginationContent>
        {Array.from({ length: totalNumberOfPages }).map((_, index) => {
          return (
            <PaginationItem
              key={index}
              className={cn("", {
                "bg-muted rounded-md": index + 1  === Number(currentPageNumber),
              })}
            >
              <PaginationLink
                href={`/blogs/${index + 1}`}
                className="cursor-pointer"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}
