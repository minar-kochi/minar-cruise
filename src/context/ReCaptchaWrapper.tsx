"use client";
import React, { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
export default function GoogleRecaptchaWrappers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <GoogleReCaptchaProvider
      container={{
        parameters: {
          badge: "bottomleft",
        },

      }}
      scriptProps={{
        appendTo: "head",
        defer:true,
        async: true,        
      }}
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
