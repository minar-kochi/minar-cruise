import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CustomLinkButton({
  href,
  label,
  className,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href}>
      <Button className={cn("", className)}>
        {icon}
        {label}
      </Button>
    </Link>
  );
}
