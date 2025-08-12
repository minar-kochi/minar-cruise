import {
  Document,
  Packer,
  Paragraph,
  TextRun,
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
  PassengerDetails,
} from "./doc-contents";
import { DOCXcolors } from "./doc-utils";
import {
  AddSpacing,
  footerNote,
  ImportantNotes,
  TermsAndConditions,
} from "./doc-helper";

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
          properties: {
            titlePage: true,
          },
          headers: {
            first: await HeaderSection(),
          },
          children: [
            // await HeaderSection(),
            BookingInformation,
            await BoardingAndPackageInformation(),
            BookingInformationHeading,
            BookingInformationContent,
            AddSpacing(),
            BillingDetails,
            AddSpacing(),
            PassengerDetails,
            new Paragraph({
              spacing: {
                before: 300,
                line: 150,
              },
              children: [
                new TextRun({
                  text: "Passenger should report at terminal One Hour (1 Hour) before departure time. Terminal gate close 30 minutes before scheduled departure.",
                  size: 12,
                }),
              ],
            }),
            new Paragraph({
              heading: "Heading6",
              style: DOCXcolors.black,
              children: [
                new TextRun({
                  text: "Terms and Conditions :",
                  bold: true,
                  size: 16,
                }),
              ],
              spacing: {
                before: 360,
              },
            }),
            ...TermsAndConditions.map((text) => {
              return new Paragraph({
                children: [
                  new TextRun({
                    text,
                    size: 12,
                  }),
                ],
                spacing: {
                  line: 170,
                },
                numbering: {
                  reference: "my-numbering",
                  level: 0,
                },
              });
            }),
            AddSpacing(),
            new Paragraph({
              heading: "Heading6",
              style: DOCXcolors.black,
              children: [
                new TextRun({
                  text: "Important Note:",
                  bold: true,
                  size: 16,
                }),
              ],
              spacing: {
                before: 360,
              },
            }),
            ...ImportantNotes.map((note) => {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: note,
                    size: 12,
                  }),
                ],
                spacing: {
                  after: 120,
                  line: 150,
                },
              });
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: footerNote,
                  size: 14,
                  bold: true,
                }),
              ],
              spacing: {
                line: 150,
              },
            }),
          ],
        },
      ],
      numbering: {
        config: [
          {
            reference: "my-numbering",
            levels: [
              {
                level: 0,
                format: "decimal",
                text: "%1.",
                alignment: "start",
                style: {
                  paragraph: {
                    indent: { left: 480, hanging: 260 },
                  },
                  run: {
                    size: 12,
                  },
                },
              },
            ],
          },
        ],
      },
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
