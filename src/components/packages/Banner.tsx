import Bounded from "../elements/Bounded";
import { AllPackages } from "@/constants/packages/package";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Baby, Clock, Hourglass, Icon, UserRound } from "lucide-react";

const Banner = () => {
  const { Sunset } = AllPackages;

  return (
    <div className="bg-orange-100 ">
      <Bounded className="flex max-sm:flex-col max-md:gap-3 justify-between py-10">
        <aside className="space-y-3 max-md:text-center">
          <h2 className="font-bold text-4xl">{"Sunset Cruise"}</h2>
          <div className="inline-flex space-x-3">
            <Hourglass color="red" strokeWidth={2} size={30} />
            <p className="my-auto">{Sunset.time}</p>
          </div>
        </aside>
        <aside className="flex max-md:items-center max-md:flex-col my-auto  space-x-11">
          <AsideInfo label="Duration" icon={<Clock size={35} color="red" />}>
            {Sunset.duration}
          </AsideInfo>
          <AsideInfo
            label={Sunset.category.adult.label}
            icon={<UserRound size={35} color="red" />}
          >
            {Sunset.category.adult.price}
          </AsideInfo>
          <AsideInfo
            label={Sunset.category.children.label}
            icon={<Baby size={35} color="red" />}
          >
            {Sunset.category.children.price}
          </AsideInfo>
        </aside>
      </Bounded>
    </div>
  );
};

export default Banner;

function AsideInfo({
  className,
  children,
  label,
  icon,
}: {
  className?: string;
  children?: React.ReactNode;
  label?: string;
  icon?: ReactNode;
}) {
  return (
    <div className={cn("inline-flex space-x-3 border", className)}>
      <div className="my-auto">{icon}</div>
      <div className="">
        <h6 className="font-semibold text-gray-500">{label}</h6>
        <p>{children}</p>
      </div>
    </div>
  );
}
