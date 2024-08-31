import Image from "next/image";
import { facilitiesImages } from "@/constants/facilities/images";
import Bounded from "../elements/Bounded";
import Link from "next/link";
import FacilitiesTitle from "./FacilitiesTitle";

const FacilitiesImageCard = ({
  label,
  overlapTitle,
  author,
}: {
  label: string;
  overlapTitle?: string;
  author?: string;
}) => {
  const { mainImage } = facilitiesImages;
  return (
    <div className=" ">
      <div className="relative">
        <Image
          src={mainImage.url}
          alt={mainImage.alt}
          width={1920}
          height={1080}
          className="h-96 object-cover w-full "
        />

        <FacilitiesTitle title={overlapTitle ?? ""} author={author ?? ""} />
      </div>
      <Bounded className="relative -top-16 flex justify-end items-end">
        <div className="flex bottom-0 font-bold bg-white  px-7 py-5 rounded-t-xl">
          <Link href={"/"}>Home</Link> /
          <p className="text-primary whitespace-pre-line  indent-2">{label}</p>
        </div>
      </Bounded>
    </div>
  );
};

export default FacilitiesImageCard;
