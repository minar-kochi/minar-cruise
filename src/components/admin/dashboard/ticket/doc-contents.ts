import { Header } from "docx";
import { CreateMinarHeading, CreateQrCode } from "./minar-data";

export const HeaderSection = async () => {
  const CreateQrCodeImageRun = await CreateQrCode();
  return {
    default: new Header({
      children: [CreateMinarHeading, CreateQrCodeImageRun],
    }),
  };
};
