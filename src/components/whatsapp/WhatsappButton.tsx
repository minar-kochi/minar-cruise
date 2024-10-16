"use client";

import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function WhatsappButton() {
  return (
    <div className="relative">  
      <FloatingWhatsApp
        phoneNumber="7034191993"
        accountName="Minar Cruise Cochin"
        avatar="/assets/whatsapplogo.png"
        buttonClassName="absolute mb-14"
      />
    </div>
  );
}

// md:left-[30px] left-[10px]