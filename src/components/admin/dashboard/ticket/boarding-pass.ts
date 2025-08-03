import { Document, Packer } from "docx";
import { renderAsync } from "docx-preview";
import { saveAs } from "file-saver";
import { RefObject } from "react";
import { HeaderSection } from "./doc-contents";

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
          children: [],
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
    else {
      ref.current.innerHTML = "";
    }

    await renderAsync(file, ref.current, undefined, {
      ignoreHeight: true,
    });
  }
}
