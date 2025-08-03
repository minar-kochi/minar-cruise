import {
  Document,
  FrameAnchorType,
  Header,
  HorizontalPositionAlign,
  IBordersOptions,
  ImageRun,
  Packer,
  Paragraph,
  TextRun,
  VerticalPositionAlign,
} from "docx";
import { renderAsync } from "docx-preview";
import { saveAs } from "file-saver";
import { RefObject } from "react";
import { CreateQrCode } from "./doc-contents";

export class BoardingPass {
  public async createDoc({
    docViewRef,
    viewDoc,
  }: {
    viewDoc?: boolean;
    docViewRef?: RefObject<HTMLDivElement>;
  }) {
    const qrCode = await CreateQrCode();
    const doc = new Document({
      sections: [
        {
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: "center",
                  text: "Minar Cruise E-Ticker",
                  // border: this.createBorder(),
                }),
              ],
            }),
          },
          children: [qrCode],
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

  // Draws a border around the element on document
  private createBorder() {
    const border: IBordersOptions = {
      top: {
        color: "auto",
        space: 1,
        size: 6,
        style: "dashed",
      },
      bottom: {
        color: "auto",
        space: 1,
        size: 6,
        style: "dashed",
      },
      left: {
        color: "auto",
        space: 1,
        size: 6,
        style: "dashed",
      },
      right: {
        color: "auto",
        space: 1,
        size: 6,
        style: "dashed",
      },
    };
    return border;
  }

  /**
   *
   * @param doc Takes a Document type which will be converted for download
   * @param nameOfDocument Argument is used as name of the file after download 
   * @returns void
   */
  async DownloadDocument(doc: Document, nameOfDocument?: string) {
    const fileBlob = await Packer.toBlob(doc);
    saveAs(fileBlob, nameOfDocument ?? "My Document.docx");
  }

  /**
   * 
   * @param ref reference to the html, in which the content of document will be visible
   * @param file Document file which needs to be made visible on DOM
   * @returns void
   */
  async viewDocument(ref: RefObject<HTMLDivElement>, file: Blob) {
    if (!ref.current) return;

    if (ref.current) {
      ref.current.innerHTML = "";
    }

    if (!ref.current) return;

    await renderAsync(file, ref.current, undefined, {
      ignoreHeight: true,
    });
  }
}
