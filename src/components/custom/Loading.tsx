import Ripple from "@/components/magicui/ripple";

export default function LoadingState() {
  return (
    <div className="relative flex h-[calc(100vh-60px)] w-full flex-col items-center justify-center overflow-hidden border ">
      <p className="z-10 text-center tracking-tighter text-muted-foreground dark:text-white/40 text-2xl p-6 font-semibold">
        Loading . . .
      </p>
      <Ripple />
    </div>
  );
}
