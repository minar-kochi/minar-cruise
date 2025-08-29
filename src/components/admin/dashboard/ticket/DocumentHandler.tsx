"use client";

import { Button } from "@/components/ui/button";
import { BoardingPass } from "./boarding-pass";
import { useRef } from "react";

export default function DocumentHandler() {
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

export type BoardingPassDetails = {
  bookingId: string
  bookingMode: string
  bookingDate: string

  reportingTime: string
  boardingTime: string
  departureTime: string

  contactNumber: string
  emailId: string
  package:string
  passengers: {
    adults: number,
    children: number,
    infant: number 
  },
  
  totalCharge: string
  user: {
    name: string
    age: string
  }
}
