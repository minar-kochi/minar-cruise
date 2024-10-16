import { Button } from "../ui/button";
import { footer } from "@/constants/home/landingData";
import Image from "next/image";
import Link from "next/link";

const SocialCard = () => {
  const { socials } = footer;
  return (
    <>
      <div className="flex justify-end max-sm:justify-evenly space-x-3 py-5">
        {socials.map((item, i) => (
          <Link
            className="bg-white] hover:bg-[#102539ee]"
            key={`${item.icon}${i}`}
            href={item.url}
            target="_blank"
          >
            <Image alt={item.name} src={item.icon} width={30} height={30} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default SocialCard;
