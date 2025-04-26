import { TableBody } from "@/components/ui/table";

export default function TableLoadingAnimation() {
  return (
    <div className="border p-2 m-2 flex flex-col gap-2">
      {Array.from({ length: 9 }, (_, i) => {
        return <div className="bg-muted animate-pulse h-16" key={i}></div>;
      })}
    </div>
  );
}
