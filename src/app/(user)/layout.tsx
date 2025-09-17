import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import WhatsappButton from "@/components/whatsapp/WhatsappButton";
import GoogleRecaptchaWrappers from "@/context/ReCaptchaWrapper";
import GoogleAnalyticsWrapper from "@/context/services/GoogleAnalytics";
import Providers from "@/context/TrpcProvider";
import { cn } from "@/lib/utils";
import InitialClientStateDispatcher from "@/wrapper/client/initial-client-state-dispatcher";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Manrope as FontSans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
import { redirect } from "next/navigation";
// import Footer from "@/components/footer/Footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = constructMetadata({});

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  if (
    process.env.NEXT_PUBLIC_MAINTENANCE &&
    process.env.NEXT_PUBLIC_MAINTENANCE === "1"
  ) {
    redirect("/maintenance");
  }

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <GoogleRecaptchaWrappers>
          <InitialClientStateDispatcher>
            <Providers>
              <Toaster />
              {modal}
              <div id="modal-root" />
              <Navbar />
              <div className="">{children}</div>
              <WhatsappButton />
              <Footer />
            </Providers>
          </InitialClientStateDispatcher>
        </GoogleRecaptchaWrappers>
        <GoogleAnalyticsWrapper />
        <SpeedInsights />
      </body>
      <Script async defer src="https://checkout.razorpay.com/v1/checkout.js" />
    </html>
  );
}
