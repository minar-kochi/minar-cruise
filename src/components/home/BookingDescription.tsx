import { BookingData } from "@/constants/home/landingData";
import Image from "next/image";
import { Button } from "../ui/button";
import BookingDescriptionCard from "./BookingDescriptionCard";

const BookingDescription = () => {
  const { image1, image2 } = BookingData;
  return (
    <section  className="relative flex min-h-[80vh] ">
      <div className="w-full basis-[45%] max-md:hidden ">
        <Image
          width={1280}
          height={720}
          className="w-full h-full object-cover"
          src={image1.url}
          alt={image1.alt}
        />
      </div>
      <div className="w-full basis-[55%] max-md:basis-full">
        <Image
          className="w-full h-full object-cover object-center"
          width={1280}
          height={720}
          src={image2.url}
          alt={image2.alt}
        />
      </div>
      <BookingDescriptionCard/>
    </section>
  );
};

export default BookingDescription;

// <div className="p-12 h-full flex flex-col justify-evenly">
            
//             <Button>Book Now</Button>
//           </div>
