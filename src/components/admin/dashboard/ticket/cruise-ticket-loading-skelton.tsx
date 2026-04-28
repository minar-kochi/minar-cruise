"use client";

import { useLayoutEffect, useRef, useState } from "react";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

const CruiseTicketLoadingSkelton = ({
  size,
  loading = true,
}: {
  size?: "sm" | "lg";
  loading?: boolean;
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (size === "sm") return;
    const update = () => {
      const w = wrapperRef.current?.clientWidth ?? PAGE_WIDTH;
      setScale(Math.min(1, w / PAGE_WIDTH));
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [size]);

  if (size === "sm") {
    return (
      <div className="mx-auto my-4 w-[150px] h-[200px] bg-white shadow-md rounded-sm overflow-hidden relative">
        {loading && <Shine />}
      </div>
    );
  }

  return (
    <div className="mx-auto my-4 md:my-8 max-w-[794px] px-2 md:px-4">
      <div
        ref={wrapperRef}
        style={{ height: PAGE_HEIGHT * scale }}
        className="relative w-full overflow-hidden"
      >
        <div
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="bg-white shadow-lg ring-1 ring-slate-200 relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 h-full w-1.5 bg-slate-200" />
          <div className="px-12 py-10 h-full flex flex-col">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="h-14 w-48 bg-slate-100 rounded" />
                <div className="h-3 w-28 bg-slate-100 rounded" />
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-7 w-32 bg-slate-100 rounded" />
                <div className="h-px w-16 bg-slate-200 mx-auto" />
                <div className="h-3 w-24 bg-slate-100 rounded mx-auto" />
              </div>
              <div className="h-24 w-24 bg-slate-100 rounded-sm" />
            </div>

            <div className="mt-8 border-t border-slate-200" />

            <div className="mt-6 h-12 w-full bg-slate-100 rounded-sm" />

            <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-7">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-2.5 w-20 bg-slate-100 rounded" />
                  <div className="h-4 w-40 bg-slate-100 rounded" />
                </div>
              ))}
            </div>

            <div className="mt-7 h-14 w-full bg-red-50 rounded-sm" />

            <div className="flex-1" />

            <div className="mt-6 space-y-2">
              <div className="h-3 w-32 bg-slate-100 rounded" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-2.5 w-full bg-slate-50 rounded" />
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-3 flex justify-between">
              <div className="h-2.5 w-48 bg-slate-100 rounded" />
              <div className="h-2.5 w-56 bg-slate-100 rounded" />
            </div>
          </div>
          {loading && <Shine />}
        </div>
      </div>
    </div>
  );
};

const Shine = () => (
  <div
    className="absolute inset-0 electric-shine-fullscreen opacity-40 pointer-events-none"
    style={{
      background:
        "linear-gradient(45deg, transparent 25%, rgba(59,130,246,0.3) 35%, rgba(147,197,253,0.7) 45%, rgba(255,255,255,0.95) 50%, rgba(147,197,253,0.7) 55%, rgba(59,130,246,0.3) 65%, transparent 75%)",
    }}
  />
);

export default CruiseTicketLoadingSkelton;
