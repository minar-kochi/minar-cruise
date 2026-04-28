"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { toBlob } from "html-to-image";
import { CheckIcon, DownloadIcon, LinkIcon } from "lucide-react";

import { TermsAndConditions } from "./doc-helper";
import { createBookingData } from "@/lib/helpers/ticket";
import { TGetUserBookingDetails } from "@/db/data/dto/booking";
import { trpc } from "@/app/_trpc/client";
import Bounded from "@/components/elements/Bounded";
import { Button } from "@/components/ui/button";

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  age: string;
  seatNo: string;
  status: string;
}

export interface TicketData {
  bookingId: string;
  contactNum: string;
  emailId: string;
  bookingMode: string;
  bookingDate: string;
  bookingPackage: string;
  boardingTime: string;
  departureDate: string;
  reportingTime: string;
  departureTime: string;
  passengers: {
    adult: number;
    child: number;
    infant: number;
  };
  charges: {
    passengerCharges: {
      adult: number;
      children: number;
      infant: number;
    };
    additionalCharges: number;
    vehicleCharges: number;
    totalFare: number;
    baseAmount: number;
    gstRate: number;
    gstAmount: number;
  };
  supplierGSTIN: string;
  sacCode: string;
  passengerDetails: PassengerDetails[];
}

interface CruiseTicketProps {
  data: TGetUserBookingDetails | null;
}

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

const LOGO_URL = "/assets/logo.png";
const QR_URL = "/assets/documents/QR.png";
const BOAT_URL = "/logo-small.png";

const CruiseTicket = ({ data }: CruiseTicketProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    const update = () => {
      const w = wrapperRef.current?.clientWidth ?? PAGE_WIDTH;
      setScale(Math.min(1, w / PAGE_WIDTH));
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Preload + decode the static assets on mount so the first download click
  // never races against a half-loaded image (especially the 3000×3000 QR).
  useEffect(() => {
    [LOGO_URL, QR_URL, BOAT_URL].forEach((src) => {
      const img = new window.Image();
      img.src = src;
      if (img.decode) img.decode().catch(() => {});
    });
  }, []);

  const { data: taxConfig } =
    trpc.admin.taxConfig.getPublicTaxConfig.useQuery(undefined, {
      staleTime: 5 * 60 * 1000,
    });

  if (!data) return null;

  const ticket = createBookingData({
    data,
    gstin: taxConfig?.gstin,
    sacCode: taxConfig?.sacCode,
  });

  const customerName = data?.user?.name || "Guest";
  const departureDate = ticket.departureDate
    ? format(new Date(ticket.departureDate), "dd MMM yyyy")
    : "—";
  const departureTime = ticket.departureTime || "—";
  const passengerSummary = formatPassengers(ticket.passengers);
  const hasGST = ticket.charges.gstAmount > 0;

  const filename = `Minar-Boarding-Pass-${ticket.bookingId || "ticket"}.png`;

  const handleCopyLink = async () => {
    const url =
      typeof window !== "undefined"
        ? ticket.bookingId
          ? `${window.location.origin}/success/bookings?b_id=${ticket.bookingId}`
          : window.location.href
        : "";
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleDownload = async () => {
    if (!captureRef.current) return;
    setGenerating(true);
    try {
      // Make sure every <img> in the capture node is fully decoded before
      // the snapshot — `decode()` is stricter than waiting for `load`.
      const imgs = captureRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(imgs).map(async (img) => {
          if (!(img.complete && img.naturalWidth > 0)) {
            await new Promise<void>((resolve) => {
              const done = () => resolve();
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
            });
          }
          if (img.decode) {
            try {
              await img.decode();
            } catch {
              /* ignore — decode can reject for valid images on some browsers */
            }
          }
        }),
      );

      const blob = await toBlob(captureRef.current, {
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      if (!blob) throw new Error("Empty image");

      const file = new File([blob], filename, { type: "image/png" });

      // Touch devices (iOS / Android): use the Web Share API so the user can
      // pick "Save Image" (Photos on iOS), WhatsApp, etc. Desktop Chromium
      // (Arc, Chrome on macOS) also exposes share/canShare, but its share
      // sheet flattens files+title into a path string on Copy — so gate on
      // a coarse pointer to keep desktop on the plain download path below.
      const isTouchDevice =
        typeof window !== "undefined" &&
        window.matchMedia?.("(pointer: coarse)").matches;
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
      };
      if (
        isTouchDevice &&
        typeof nav.share === "function" &&
        nav.canShare &&
        nav.canShare({ files: [file] })
      ) {
        try {
          await nav.share({
            files: [file],
            title: "Minar Boarding Pass",
          });
          return;
        } catch (err) {
          if ((err as DOMException)?.name === "AbortError") return;
          // any other failure → fall through to the download path
        }
      }

      // Desktop / fallback: trigger a regular download.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Image generation failed", err);
    } finally {
      setGenerating(false);
    }
  };

  const ticketBody = (
    <TicketBody
      bookingId={ticket.bookingId}
      customerName={customerName}
      contactNum={ticket.contactNum}
      bookingPackage={ticket.bookingPackage || "—"}
      passengerSummary={passengerSummary}
      departureDate={departureDate}
      departureTime={departureTime}
      hasGST={hasGST}
      totalFare={ticket.charges.totalFare}
      baseAmount={ticket.charges.baseAmount}
      gstAmount={ticket.charges.gstAmount}
      gstRate={ticket.charges.gstRate}
      gstin={ticket.supplierGSTIN}
      sacCode={ticket.sacCode}
    />
  );

  return (
    <Bounded className="md:px-4 px-2">
      <div className="mx-auto my-4 md:my-8 max-w-[794px]">
        <div className="flex justify-end items-center gap-1 mb-3">
          <Button onClick={handleCopyLink} variant="link">
            {copied ? (
              <CheckIcon className="size-5 mr-2 text-emerald-600" />
            ) : (
              <LinkIcon className="size-5 mr-2" />
            )}
            {copied ? "Link Copied" : "Copy Link"}
          </Button>
          <Button
            onClick={handleDownload}
            variant="link"
            disabled={generating}
          >
            <DownloadIcon className="size-5 mr-2" />
            {generating ? "Generating..." : "Download Ticket"}
          </Button>
        </div>

        {/* Visible, responsive copy. */}
        <div
          ref={wrapperRef}
          style={{ height: PAGE_HEIGHT * scale }}
          className="relative w-full overflow-hidden"
        >
          <div
            style={{
              width: PAGE_WIDTH,
              height: PAGE_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="bg-white text-slate-900 font-sans shadow-lg border border-slate-200"
          >
            {ticketBody}
          </div>
        </div>
      </div>

      {/* Hidden off-screen, full-size copy used for image capture. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: "-100000px",
          top: 0,
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          pointerEvents: "none",
        }}
      >
        <div
          ref={captureRef}
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
          className="bg-white text-slate-900 font-sans"
        >
          {ticketBody}
        </div>
      </div>
    </Bounded>
  );
};

function TicketBody(props: {
  bookingId: string;
  customerName: string;
  contactNum: string;
  bookingPackage: string;
  passengerSummary: string;
  departureDate: string;
  departureTime: string;
  hasGST: boolean;
  totalFare: number;
  baseAmount: number;
  gstAmount: number;
  gstRate: number;
  gstin: string;
  sacCode: string;
}) {
  const {
    bookingId,
    customerName,
    contactNum,
    bookingPackage,
    passengerSummary,
    departureDate,
    departureTime,
    hasGST,
    totalFare,
    baseAmount,
    gstAmount,
    gstRate,
    gstin,
    sacCode,
  } = props;

  return (
    <div className="relative h-full w-full flex flex-col px-12 py-10">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-slate-900" />

      <header className="flex items-start justify-between gap-6">
        <div className="flex flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_URL}
            alt="Minar Cruise"
            width={404}
            height={82}
            className="h-14 w-auto block"
          />
          <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-slate-500">
            Cochin Cruise Line
          </p>
        </div>

        <div className="text-center pt-1">
          <h1 className="text-2xl font-bold tracking-[0.2em] text-slate-900">
            E-TICKET
          </h1>
          <div className="mt-2 mx-auto h-px w-16 bg-slate-900" />
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Boarding Pass
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={QR_URL}
          alt="Booking QR code"
          width={96}
          height={96}
          className="h-24 w-24 border border-slate-200 rounded-sm block"
        />
      </header>

      <div className="mt-8 border-t border-slate-200" />

      <div className="mt-6 flex items-center justify-between bg-slate-50 px-5 py-3 rounded-sm border border-slate-200">
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
          Booking ID
        </span>
        <span className="font-mono text-base font-semibold tracking-wider text-slate-900">
          {bookingId || "—"}
        </span>
      </div>

      <section className="relative mt-8 grid grid-cols-2 gap-x-10 gap-y-7">
        <Field label="Customer Name" value={customerName} />
        <Field label="Phone Number" value={contactNum || "—"} />

        <Field label="Package" value={bookingPackage} />
        <Field label="Passengers" value={passengerSummary} />

        <Field label="Departure Date" value={departureDate} />
        <Field label="Boarding Time" value={departureTime} />
      </section>

      <div className="mt-7 rounded-sm border border-red-200 bg-red-50 px-5 py-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-red-700">
          Reporting Time
        </p>
        <p className="mt-1 text-sm font-medium text-red-700">
          Please report at the terminal 30 minutes before boarding time.
        </p>
      </div>

      <div className="pointer-events-none absolute right-12 top-[58%] -translate-y-1/2 opacity-[0.06]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BOAT_URL}
          alt=""
          width={146}
          height={82}
          className="h-32 w-auto block"
        />
      </div>

      {totalFare > 0 && (
        <div className="mt-6 rounded-sm border border-slate-300 bg-slate-50 px-5 py-4">
          {hasGST && (
            <div className="space-y-1.5 text-[12px] text-slate-600 tabular-nums">
              <div className="flex items-center justify-between">
                <span>Base Fare</span>
                <span className="font-medium text-slate-800">
                  ₹{formatINR(baseAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST ({gstRate}%)</span>
                <span className="font-medium text-slate-800">
                  ₹{formatINR(gstAmount)}
                </span>
              </div>
            </div>
          )}

          <div
            className={`flex items-end justify-between gap-4 ${
              hasGST ? "mt-3 border-t border-slate-300 pt-3" : ""
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-700">
              Amount Paid
            </p>
            <p className="text-[26px] font-bold leading-none text-slate-900 tabular-nums">
              ₹{formatINR(totalFare)}
            </p>
          </div>

          {hasGST && (
            <div className="mt-3 flex items-center justify-between gap-4 border-t border-slate-200 pt-2 text-[10px] text-slate-500">
              <span>
                <span className="text-slate-400 uppercase tracking-wider">
                  GSTIN
                </span>{" "}
                <span className="font-medium text-slate-700">{gstin}</span>
              </span>
              <span>
                <span className="text-slate-400 uppercase tracking-wider">
                  SAC
                </span>{" "}
                <span className="font-medium text-slate-700">{sacCode}</span>
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex-1" />

      <section className="mt-6 rounded-sm border border-slate-200 bg-slate-50/70 px-5 py-4">
        <div className="mb-2.5 flex items-center gap-2">
          <span className="block h-3.5 w-1 rounded-sm bg-slate-900" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900">
            Terms &amp; Conditions
          </h2>
        </div>
        <ol className="list-decimal space-y-1.5 pl-5 text-[11.5px] leading-[1.55] text-slate-700 marker:font-semibold marker:text-slate-500">
          {TermsAndConditions.map((term, i) => (
            <li key={i}>{term}</li>
          ))}
        </ol>
      </section>

      <footer className="mt-6 border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>Computer-generated ticket — no signature required.</span>
        <span>info@cochincruiseline.com&nbsp;·&nbsp;+91 8089021666</span>
      </footer>
    </div>
  );
}

function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>
      <p className="mt-1.5 text-[15px] font-medium text-slate-900 break-words">
        {value}
      </p>
    </div>
  );
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
function formatINR(amount: number) {
  return inrFormatter.format(amount);
}

function formatPassengers(p: { adult: number; child: number; infant: number }) {
  const parts: string[] = [];
  if (p.adult) parts.push(`${p.adult} Adult${p.adult > 1 ? "s" : ""}`);
  if (p.child) parts.push(`${p.child} Child${p.child > 1 ? "ren" : ""}`);
  if (p.infant) parts.push(`${p.infant} Infant${p.infant > 1 ? "s" : ""}`);
  return parts.length ? parts.join(" · ") : "—";
}

export default CruiseTicket;
