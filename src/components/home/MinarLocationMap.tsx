import React from "react";
import Bounded from "../elements/Bounded";

export default function MinarLocationMap() {
  return (
    <Bounded className="h-auto my-28">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.407263411496!2d76.27109607617906!3d9.983177590121407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d579b7cc2ab%3A0xa11b51d761092ac5!2sMinar%20Cruise%20Cochin!5e0!3m2!1sen!2sin!4v1753297339544!5m2!1sen!2sin"
        width="600"
        height="450"
        allowFullScreen={false}
        loading="lazy"
        className="w-full"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </Bounded>
  );
}
