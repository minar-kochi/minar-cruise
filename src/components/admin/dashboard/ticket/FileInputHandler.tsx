"use client";

import { Button } from "@/components/ui/button";
import { BoardingPass } from "./boarding-pass";
import { useRef } from "react";

export default function FileInputHandler() {
  const ref = useRef<HTMLDivElement>(null);

  const Doc = new BoardingPass();
  const doc = Doc.createDoc({ viewDoc: true, docViewRef: ref });

  async function handleClick() {
    Doc.DownloadDocument(await doc);
  }
  return (
    <div className="border">
      <div className="" ref={ref}></div>
      <Button onClick={handleClick}>Download Document</Button>
    </div>
  );
}
