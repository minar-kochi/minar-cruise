import type React from "react";
import { TermsAndConditions } from "./doc-helper";
import { format } from "date-fns";
import { createBookingData } from "@/lib/helpers/ticket";
import { TGetUserBookingDetails } from "@/db/data/dto/booking";
import Bounded from "@/components/elements/Bounded";
import { Button } from "@/components/ui/button";
import { usePDF } from "react-to-pdf";
import { DownloadIcon } from "lucide-react";
import TicketHeader from "./components/TicketHeader";
import BookingDetailsSection from "./components/BookingDetailsSection";
import PackageAndBoardingSection from "./components/PackageAndBoardingSection";
import BookingInformationSection from "./components/BookingInformationSection";
import PassengerDetailsTable from "./components/PassengerDetailsTable";
import TermsAndConditionsSection from "./components/TermsAndConditionsSection";
import ImportantNotice from "./components/ImportantNotice";
import ContactFooter from "./components/ContactFooter";

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
  };
  passengerDetails: PassengerDetails[];
}

interface CruiseTicketProps {
  data: TGetUserBookingDetails | null;
}

const qrImageUrl = `/assets/documents/QR.png`;
const minarLogo = `/assets/whatsapplogo.png`;
const boatLogo = `/logo-small.png`;

const CruiseTicket: React.FC<CruiseTicketProps> = ({ data }) => {
  const { targetRef, toPDF } = usePDF({ filename: `Minar-Boarding-Pass` });

  if (!data) return;

  const FormattedBookingData = createBookingData({ data: data });

  const {
    boardingTime,
    bookingDate,
    departureDate,
    departureTime,
    reportingTime,
    charges: {
      totalFare,
      passengerCharges: { children, adult: adultCharges },
    },
    passengers: { adult, child },
  } = FormattedBookingData;

  const FormattedBookingDate = format(bookingDate, "dd/MM/yyyy");
  const FormattedDepartureDate = format(departureDate, "dd/MM/yyyy");

  return (
    <Bounded className="md:px-4 px-[2px]">
      <div className="w-fit mx-auto my-4 md:my-8 px-2">
        <div className="flex justify-end">
          <Button className="" onClick={() => toPDF()} variant={"link"}>
            <DownloadIcon className="size-6 mr-2" />
            Download Ticket
          </Button>
        </div>
        <div
          ref={targetRef}
          className="max-w-4xl md:mx-auto bg-white px-6 sm:px-10 md:px-16 py-8 md:py-12 font-sans text-sm border-2 border-gray-200 shadow-lg text-black mt-4 rounded-lg"
        >
          <TicketHeader
            minarLogoUrl={minarLogo}
            qrCodeUrl={qrImageUrl}
          />

          <BookingDetailsSection
            customerName={data?.user?.name || "Guest"}
            bookingData={FormattedBookingData}
            formattedBookingDate={FormattedBookingDate}
          />

          <PackageAndBoardingSection
            bookingPackage={FormattedBookingData.bookingPackage}
            boardingTime={FormattedBookingData.boardingTime}
            boatLogoUrl={boatLogo}
          />

          <BookingInformationSection
            bookingData={FormattedBookingData}
            formattedDepartureDate={FormattedDepartureDate}
          />

          <PassengerDetailsTable
            passengers={FormattedBookingData.passengerDetails}
          />

          <ImportantNotice />

          <TermsAndConditionsSection terms={TermsAndConditions} />

          <ContactFooter />
        </div>
      </div>
    </Bounded>
  );
};

export default CruiseTicket;
