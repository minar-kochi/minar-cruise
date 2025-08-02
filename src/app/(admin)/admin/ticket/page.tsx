import * as fs from "fs";
import { Paragraph, patchDocument, PatchType, TextRun } from "docx";
import { ChangeEvent } from "react";
import FileInputHandler from "@/components/admin/dashboard/ticket/FileInputHandler";

export default function page() {

  return (
    <div className="h-full">
      <h1 className="text-4xl font-bold text-center w-full py-10">
        Booking ticket section
      </h1>
      <div className="">
        <FileInputHandler/>
      </div>
    </div>
  );
}
