"use client";
import HomeVideo from "@/components/home/HomeVideo";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type TPage = {};

export default function Page({}: TPage) {
  return (
    <main className="relative w-full bg-black  min-h-screen">
      <div className="w-full h-full brightness-[.2] ">
        <HomeVideo className="lg:h-screen h-screen lg:object-cover object-cover" />
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-2 sm:p-4 lg:p-8 overflow-hidden">
        <div className="bg-black/20 backdrop-blur-md rounded-lg shadow-2xl max-w-2xl w-full mx-auto text-white p-4 sm:p-6 lg:p-8 border border-white/20">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                🚢
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Under Maintenance
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed px-2 sm:px-0">
                We&apos;re currently updating our cruise booking platform to
                serve you better. Our system will be back online soon!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-white">
                For Immediate Booking Assistance
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                    <span className="text-xl sm:text-2xl">📞</span>
                    <span className="font-medium text-white text-sm sm:text-base">
                      Call Us
                    </span>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <a
                      href="tel:+918089021666"
                      className="block text-blue-200 hover:text-blue-100 transition-colors cursor-pointer text-sm sm:text-base break-all sm:break-normal"
                    >
                      +91 80890 21666
                    </a>
                    <a
                      href="tel:+918891301555"
                      className="block text-blue-200 hover:text-blue-100 transition-colors cursor-pointer text-sm sm:text-base break-all sm:break-normal"
                    >
                      +91 889130 1555
                    </a>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                    <span className="text-xl sm:text-2xl">✉️</span>
                    <span className="font-medium text-white text-sm sm:text-base">
                      Email Us
                    </span>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <a
                      href="mailto:info@cochincruiseline.com"
                      className="block text-blue-200 hover:text-blue-100 transition-colors cursor-pointer text-sm sm:text-base break-all sm:break-normal"
                    >
                      info@cochincruiseline.com
                    </a>
                    <a
                      href="mailto:bookings@cochincruiseline.com"
                      className="block text-blue-200 hover:text-blue-100 transition-colors cursor-pointer text-sm sm:text-base break-all sm:break-normal"
                    >
                      bookings@cochincruiseline.com
                    </a>
                    <a
                      href="mailto:support@cochincruiseline.com"
                      className="block text-blue-200 hover:text-blue-100 transition-colors cursor-pointer text-sm sm:text-base break-all sm:break-normal"
                    >
                      support@cochincruiseline.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-7">
              <Link
                href={"https://wa.me/918891301555"}
                className={buttonVariants({
                  variant: "default",
                  className: "flex gap-1 items-center",
                })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-whatsapp"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
                Chat now
              </Link>
              <p className="text-xs text-muted my-2">+918891301555</p>
            </div>
            <div className="text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-2">
              <p>
                We apologize for any inconvenience and appreciate your patience.
              </p>
              <p className="font-medium">Expected to be back online shortly.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
