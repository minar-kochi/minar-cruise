import { Facebook, Instagram, Twitch } from "lucide-react";
import { Button } from "../ui/button";
import { footer } from "@/constants/home/landingData";
import Image from "next/image";

const SocialCard = () => {
  const { socials } = footer;
  return (
    <>
      <div className="flex justify-end max-sm:justify-evenly space-x-3 py-5">
        {socials.map((item, i) => (
          <Button
            className="bg-white] hover:bg-[#102539ee]"
            key={`${item.icon}${i}`}
          >
            <a href={item.url}>
              <Image alt={item.name} src={item.icon} width={30} height={30} />
            </a>
          </Button>
        ))}
      </div>
    </>
  );
};

export default SocialCard;
