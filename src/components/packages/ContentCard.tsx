import Bounded from "../elements/Bounded";
import { cn } from "@/lib/utils";
import { Amenities } from "./Amenities";
import BookingCard from "./BookingCard";
import { TGetPackageById } from "@/db/data/dto/package";
import { MDXRemote } from "next-mdx-remote/rsc";

type TContentCard = {
  className?: string;
  description: string;
  amenitiesId: string;
};

const ContentCard = ({ className, description, amenitiesId }: TContentCard) => {
  return (
    <Bounded className={cn("", className)}>
      <div className="flex my-9">
        <article className="">
          <MDXRemote source={description} />
          <Amenities amenitiesId={amenitiesId} />
        </article>
        {/* <div className="basis-[30%] p-2">
          <BookingCard />
        </div> */}
      </div>
    </Bounded>
  );
};

export default ContentCard;
