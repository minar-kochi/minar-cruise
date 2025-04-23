import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useClientDispatch } from "@/hooks/clientStore/clientReducers";
import { setPageNumber } from "@/lib/features/client/Blog/BlogSlice";
import { cn } from "@/lib/utils";

interface IBlogPagination {
  totalNumberOfPages: number;
  currentPageNumber: number;
}
export default function BlogPagination({
  totalNumberOfPages,
  currentPageNumber,
}: IBlogPagination) {
  const dispatch = useClientDispatch();
  return (
    <Pagination className="pb-10">
      <PaginationContent>
        {Array.from({ length: totalNumberOfPages }).map((_, index) => {
          return (
            <PaginationItem
              key={index}
              className={cn("", { "bg-muted rounded-md": currentPageNumber === index + 1 })}
            >
              <PaginationLink
                onClick={() => dispatch(setPageNumber(index + 1))}
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
