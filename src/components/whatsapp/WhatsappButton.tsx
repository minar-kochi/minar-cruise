"use client";

import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function WhatsappButton() {
  return (
    <div className="relative">
      <FloatingWhatsApp
        className="z-[60]"
        phoneNumber={
          // process.env.NEXT_PUBLIC_WHATSAPP_CUSTOMER_SUPPORT_NUMBER ??
          // "+918891301555"
          "+917034191993"
        }
        accountName="Minar Cruise Cochin"
        avatar="/assets/whatsapplogo.png"
        buttonClassName="absolute mb-14"
      />
    </div>
  );
}

// md:left-[30px] left-[10px]
