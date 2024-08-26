import Link from "next/link";
import { Button, ButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function CustomLinkButton({
  href,
  label,
  className,
  icon,
  props,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  props?: ButtonProps;
}) {
  return (
    <Link href={href}>
      <Button {...props} className={cn("", className)}>
        {icon}
        {label}
      </Button>
    </Link>
  );
}
