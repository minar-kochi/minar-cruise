"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Download, Link2, ShieldCheck } from "lucide-react";
import Qrcode from "qrcode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShareButtons } from "./ShareButtons";

/**
 * Success panel shown after a link is generated: the URL, a copy button, a QR
 * to scan, and one-tap share targets.
 *
 * The QR is produced in the browser (same approach as the booking-error
 * component) — no server round-trip, no storage, and "Download QR" is a plain
 * anchor onto the data URL.
 */
export function GeneratedLinkPanel({
  url,
  packageTitle,
  cruiseDate,
  expiresAt,
  clampedToDeparture,
  prefillPhone,
  prefillEmail,
  onCreateAnother,
}: {
  url: string;
  packageTitle: string;
  cruiseDate: string;
  expiresAt: string;
  /** True when the TTL was shortened to the operational cut-off. */
  clampedToDeparture?: boolean;
  prefillPhone?: string | null;
  prefillEmail?: string | null;
  onCreateAnother?: () => void;
}) {
  const [qr, setQr] = useState<string>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Qrcode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    })
      .then((dataUrl) => {
        if (!cancelled) setQr(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQr(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — please select the link and copy manually");
    }
  }

  const message = `Your ${packageTitle} booking on ${cruiseDate}. Tap to confirm your seats and pay:`;

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <Check className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <h3 className="text-lg font-bold leading-tight">
            Booking link generated
          </h3>
          <p className="text-sm text-muted-foreground">
            Share it with the customer — it stops working once paid.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-md border bg-background p-2">
        <Link2 className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          aria-label="Booking link URL"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="mr-1 h-4 w-4" />
          ) : (
            <Copy className="mr-1 h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[auto,1fr] sm:items-start">
        {qr ? (
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              alt={`QR code for the ${packageTitle} booking link`}
              className="h-36 w-36 rounded-md border bg-white p-1"
            />
            <Button asChild variant="ghost" size="sm">
              <a href={qr} download={`booking-link-qr.png`}>
                <Download className="mr-1 h-4 w-4" />
                Download QR
              </a>
            </Button>
          </div>
        ) : (
          <div className="h-36 w-36 animate-pulse rounded-md border bg-muted" />
        )}

        <div className="space-y-3">
          <ShareButtons
            url={url}
            message={message}
            subject={`Your Minar Cruise booking — ${packageTitle}`}
            phone={prefillPhone}
            email={prefillEmail}
          />

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Single use. Expires {expiresAt}
            {clampedToDeparture
              ? " — shortened to the cut-off before departure."
              : "."}
          </p>

          {onCreateAnother ? (
            <Button type="button" variant="secondary" onClick={onCreateAnother}>
              Create another link
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
