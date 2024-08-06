import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";

interface ICustomCardProps {
  className?: string;
  label?: string;
  tableHeadLabel: string[];
  tableBodyContent: object[];
}
export default function CustomTable({
  className,
  label,
  tableHeadLabel,
  tableBodyContent,
}: ICustomCardProps) {
  return (
    <Table className={cn("border", className)}>
      <TableHeader>
        <TableRow className="text-center">
          {tableHeadLabel.map((item, i) => (
            <TableHead key={item + i} className="text-center">
              {item}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableBodyContent.map((item) => {
          return (
            <>
              <TableRow className="text-center">
                <TableCell className="relative"></TableCell>
              </TableRow>
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}
