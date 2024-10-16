import { bookingNumber, contactInfo } from "@/constants/contact/contact";
import { Phone } from "lucide-react";

const ContactNumber = () => {
  return (
    <div className="">
      <h3 className="flex flex-col items-start font-bold text-3xl mb-6 tracking-wider">
        For Booking
      </h3>
      <div className="flex flex-col gap-3">
        {bookingNumber.map((item, i) => {
          return (
            <div className="flex items-center gap-3 " key={item + i}>
              <Phone
                size={15}
                className="bg-primary rounded-sm p-1"
                stroke="white"
                fill="white"
              />
              <p className="text-slate-500 font-medium ">{item}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactNumber;
