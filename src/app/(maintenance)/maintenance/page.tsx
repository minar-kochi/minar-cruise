"use client";
import HomeVideo from "@/components/home/HomeVideo";

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
                We're currently updating our cruise booking platform to serve
                you better. Our system will be back online soon!
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
                      href="tel:+919876543210"
                      className="block text-blue-200 hover:text-blue-100 transition-colors cursor-pointer text-sm sm:text-base break-all sm:break-normal"
                    >
                      +91 98765 43210
                    </a>
                    <a
                      href="tel:+917034191993"
                      className="block text-blue-200 hover:text-blue-100 transition-colors cursor-pointer text-sm sm:text-base break-all sm:break-normal"
                    >
                      +91 7034191993
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
