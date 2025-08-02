"use client";

import { BoardingPass } from "./boarding-pass";
import { useRef } from "react";

export default function FileInputHandler() {
  const ref = useRef<HTMLDivElement>(null);

  const Doc = new BoardingPass();
  Doc.createDoc({ viewDoc: true, docViewRef: ref });

  return (
    <div className="border">
      <div className="" ref={ref}></div>
    </div>
  );
}
