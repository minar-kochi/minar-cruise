import { TAmenities } from "@/db/data/dto/package";
import Bounded from "../elements/Bounded";
import { CircleCheck } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

interface IPackageDescriptionCard {
  amenities: TAmenities;
  description: string;
}
export default function PackageDescriptionCard({
  amenities,
  description,
}: IPackageDescriptionCard) {
  return (
    <Bounded className="bg-white rounded-xl md:rounded-3xl py-10">
      <div className="">
        <ul className="flex flex-col flex-wrap gap-5 md:max-h-[130px] mb-8 ">
          {amenities.description.map((item, i) => {
            return (
              <li key={item + i} className="flex items-center lg:gap-3  gap-5 ">
                <CircleCheck strokeWidth={3} />
                <p className="text-sm tracking-wider font-semibold lg:text-xl">
                  {item}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="text-justify ">
        <MDXRemote source={description} />
      </div>
    </Bounded>
  );
}
