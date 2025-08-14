import Image from "next/image";
import Qrcode from "qrcode";
import { useEffect, useState } from "react";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
export default function BookingError({ BookingId }: { BookingId?: string }) {
  const [QrUrl, setQrUrl] = useState<string>();
  useEffect(() => {
    async function handleQr() {
      // Qrcode.toDataURL()
      const qrCodeDataURL = await Qrcode.toDataURL(
        `${DOMAIN}/success/bookings?b_id=${BookingId}`,
        {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
      );
      setQrUrl(qrCodeDataURL);
    }
    handleQr();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stars */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="absolute top-32 right-32 w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="absolute bottom-40 left-40 w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="absolute top-60 left-60 w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="absolute bottom-60 right-20 w-1 h-1 bg-gray-300 rounded-full"></div>

        {/* Planets */}
        <div className="absolute top-16 right-20 w-8 h-8 bg-gray-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 left-16 w-6 h-6 bg-gray-200 rounded-full opacity-40"></div>
        <div className="absolute top-40 left-32 w-4 h-4 bg-gray-200 rounded-full opacity-30"></div>

        {/* Crescent moon */}
        <div className="absolute top-24 left-80 w-6 h-6 bg-gray-200 rounded-full opacity-40">
          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="text-center z-10 max-w-md mx-auto py-14 rounded-lg bg-gray-200">
        {/* Astronaut illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="animate-bounce"
            >
              {/* Astronaut body */}
              <ellipse cx="60" cy="80" rx="25" ry="30" fill="#ff6b6b" />

              {/* Helmet */}
              <circle
                cx="60"
                cy="45"
                r="30"
                fill="#ffffff"
                stroke="#e0e0e0"
                strokeWidth="2"
              />
              <circle cx="60" cy="45" r="25" fill="rgba(240, 240, 240, 0.3)" />

              {/* Face */}
              <circle cx="52" cy="40" r="2" fill="#333" />
              <circle cx="68" cy="40" r="2" fill="#333" />
              <ellipse cx="60" cy="50" rx="4" ry="2" fill="#ff6b6b" />

              {/* Arms */}
              <ellipse
                cx="35"
                cy="70"
                rx="8"
                ry="15"
                fill="#ff6b6b"
                transform="rotate(-20 35 70)"
              />
              <ellipse
                cx="85"
                cy="70"
                rx="8"
                ry="15"
                fill="#ff6b6b"
                transform="rotate(20 85 70)"
              />

              {/* Gloves */}
              <circle cx="30" cy="80" r="6" fill="#ffffff" />
              <circle cx="90" cy="80" r="6" fill="#ffffff" />

              {/* Legs */}
              <ellipse cx="50" cy="105" rx="8" ry="15" fill="#ff6b6b" />
              <ellipse cx="70" cy="105" rx="8" ry="15" fill="#ff6b6b" />

              {/* Boots */}
              <ellipse cx="50" cy="115" rx="10" ry="6" fill="#333" />
              <ellipse cx="70" cy="115" rx="10" ry="6" fill="#333" />

              {/* Antenna */}
              <line
                x1="60"
                y1="15"
                x2="60"
                y2="5"
                stroke="#e0e0e0"
                strokeWidth="2"
              />
              <circle cx="60" cy="5" r="3" fill="#ff6b6b" />
            </svg>

            {/* Floating effect lines */}
            <div className="absolute -top-2 -right-2 w-8 h-1 bg-gray-300 rounded opacity-60"></div>
            <div className="absolute -top-4 right-4 w-6 h-1 bg-gray-300 rounded opacity-40"></div>
            <div className="absolute -bottom-2 -left-2 w-10 h-1 bg-gray-300 rounded opacity-50"></div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-black mb-4 font-sans"></h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Unable to generate boarding pass at the moment, please check later.
        </p>

        {BookingId ? (
          <div className="">
            <p>
              Kindly use the given Booking Id for checking the booking status
              later
            </p>
            <p className="p-1 border w-fit mx-auto px-2 shadow-xl rounded-sm my-2 bg-primary text-secondary font-bold text-lg">
              Booking ID :{BookingId}
            </p>
          </div>
        ) : null}
        <div className="my-8">
          <p className="text-xl font-bold">Or</p>
        </div>
        {QrUrl ? (
          <figure>
            <Image
              src={QrUrl}
              alt="Qrcode"
              width={1080}
              height={720}
              className="w-40 md:w-64 h-40 md:h-64 mx-auto "
            />
            <p className="pb-2">
              Scan this Qr code later <br />
              to check booking status
            </p>
          </figure>
        ) : null}
      </div>
    </div>
  );
}
