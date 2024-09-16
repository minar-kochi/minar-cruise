import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

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
  props?: VariantProps<typeof buttonVariants>;
}) {
  return (
    <Link href={href} className={cn(buttonVariants(props), className)}>
      {icon}
      {label}
    </Link>
  );
}
