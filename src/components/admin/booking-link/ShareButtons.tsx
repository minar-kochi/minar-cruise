"use client";

import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, MessageSquare, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Plain links, no SDKs — every target here is a URL scheme the OS resolves.
 * When a prefill phone exists the WhatsApp/SMS links address that number
 * directly, which turns sharing into a single tap.
 */
export function ShareButtons({
  url,
  message,
  subject,
  phone,
  email,
}: {
  url: string;
  message: string;
  subject: string;
  phone?: string | null;
  email?: string | null;
}) {
  // navigator.share is absent on most desktop browsers; only offer it when real.
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const body = `${message}\n\n${url}`;
  const encodedBody = encodeURIComponent(body);

  // wa.me wants a bare country-code-prefixed number.
  const waNumber = phone?.replace(/\D/g, "").replace(/^0+/, "");
  const waTarget =
    waNumber && waNumber.length >= 10
      ? `https://wa.me/${waNumber.length === 10 ? `91${waNumber}` : waNumber}`
      : "https://wa.me/";

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Button asChild variant="outline" className="justify-start gap-2">
        <a href={`${waTarget}?text=${encodedBody}`} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>

      <Button asChild variant="outline" className="justify-start gap-2">
        <a
          href={`mailto:${email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodedBody}`}
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
      </Button>

      {/* `?&body=` is the form that works on both iOS and Android. */}
      <Button asChild variant="outline" className="justify-start gap-2">
        <a href={`sms:${phone ?? ""}?&body=${encodedBody}`}>
          <MessageSquare className="h-4 w-4" />
          SMS
        </a>
      </Button>

      {canNativeShare ? (
        <Button
          type="button"
          variant="outline"
          className="justify-start gap-2"
          onClick={() =>
            navigator.share({ title: subject, text: message, url }).catch(() => {
              /* user dismissed the sheet */
            })
          }
        >
          <Share2 className="h-4 w-4" />
          More
        </Button>
      ) : null}
    </div>
  );
}
