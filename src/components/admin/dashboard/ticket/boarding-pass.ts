import {
  Border,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  SectionProperties,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { renderAsync } from "docx-preview";
import { saveAs } from "file-saver";
import { RefObject } from "react";
import {
  BillingDetails,
  BoardingAndPackageInformation,
  BookingInformation,
  BookingInformationContent,
  BookingInformationHeading,
  HeaderSection,
} from "./doc-contents";
import { DOCXcolors, RemoveTableBorder } from "./doc-utils";

export class BoardingPass {
  public async createDoc({
    docViewRef,
    viewDoc,
  }: {
    viewDoc?: boolean;
    docViewRef?: RefObject<HTMLDivElement>;
  }) {
    const doc = new Document({
      sections: [
        {
          headers: await HeaderSection(),
          children: [
            BookingInformation,
            await BoardingAndPackageInformation(),
            BookingInformationHeading,
            BookingInformationContent,
            // BillingDetails
          ],
        },
      ],
    });

    // converting generated document to blob
    const docBlob = await Packer.toBlob(doc);

    // checking if document needs to be made visible on DOM
    if (viewDoc) {
      if (!docViewRef) return docBlob;
      await this.viewDocument(docViewRef, docBlob);
    }

    return docBlob;
  }

  /**
   *
   * @param doc Takes a Document type which will be converted for download
   * @param nameOfDocument Argument is used as name of the file after download
   * @returns void
   */
  async DownloadDocument(docBlob: Blob, nameOfDocument?: string) {
    // const fileBlob = await Packer.toBlob(doc);
    saveAs(docBlob, nameOfDocument ?? "My Document.docx");
  }

  /**
   *
   * @param ref Reference to the html div element, in which the content of document needs to be rendered visible
   * @param file Document file which needs to be made visible on DOM
   * @returns void
   */
  async viewDocument(ref: RefObject<HTMLDivElement>, file: Blob) {
    if (!ref.current) return;
    else {
      ref.current.innerHTML = "";
    }

    await renderAsync(file, ref.current, undefined, {
      ignoreHeight: true,
    });
  }
}
