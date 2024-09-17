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
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCH_SITE_KEY!}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
