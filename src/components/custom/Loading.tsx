import Ripple from "@/components/magicui/ripple";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Loader({
  className,
  size,
}: {
  size?: number;
  className: string;
}) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="flex items-center gap-4">
        <Loader2 className="animate-spin" size={size ?? 50} />
        <p className="text-4xl">loading...</p>
      </div>
    </div>
  );
}
