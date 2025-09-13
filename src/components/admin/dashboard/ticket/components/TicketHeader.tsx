import type React from "react";
import Image from "next/image";

interface TicketHeaderProps {
  minarLogoUrl: string;
  qrCodeUrl: string;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({
  minarLogoUrl,
  qrCodeUrl,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
      <div className="flex items-center order-1 sm:order-1">
        <Image
          src={minarLogoUrl || "/placeholder.svg"}
          alt="MINAR"
          className="w-auto h-12 sm:h-16 md:h-20"
          width={720}
          height={480}
        />
      </div>
      <div className="text-center order-2 sm:order-2 flex-1">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-black">
          MINAR CRUISE E-TICKET
        </h1>
      </div>
      <Image
        src={qrCodeUrl || "/placeholder.svg"}
        alt="minar-qr-code"
        width={1080}
        height={720}
        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center order-3 sm:order-3"
      />
    </div>
  );
};

export default TicketHeader;