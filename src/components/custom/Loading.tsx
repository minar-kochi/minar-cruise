import Ripple from "@/components/magicui/ripple";

export default function LoadingState() {
  return (
    <div className="relative flex min-h-[320px] aspect-square max-h-[calc(100dvh-14rem)] w-full flex-col items-center justify-center overflow-hidden ">
      <p className="z-10 text-center tracking-tighter text-muted-foreground dark:text-white/40 text-2xl p-6 font-semibold">
        Loading . . .
      </p>
      <Ripple />
    </div>
  );
}
