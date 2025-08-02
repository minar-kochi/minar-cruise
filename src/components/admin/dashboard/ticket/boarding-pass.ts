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
import { QrCode } from "./doc-contents";

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
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: "center",
                  text: "Minar Cruise E-Ticker",
                  border: this.createBorder(),
                }),
              ],
            }),
          },
          children: [QrCode],
        },
      ],
    });

    const docBlob = await Packer.toBlob(doc);

    if (viewDoc) {
      if (!docViewRef) return docBlob;
      await this.viewDocument(docViewRef, docBlob);
    }

    return docBlob;
  }

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

  async DownloadDocument(doc: Document) {
    const fileBlob = await Packer.toBlob(doc);
    saveAs(fileBlob, "My Document.docx");
  }

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
