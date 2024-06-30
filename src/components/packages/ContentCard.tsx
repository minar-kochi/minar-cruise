import { Package } from "@prisma/client";
import Bounded from "../elements/Bounded";
import { cn } from "@/lib/utils";
import { Amenities } from "./Amenities";
import BookingCard from "./BookingCard";

type TContentCard = Package & {
  className?: string;
};

const ContentCard = ({ className, description, amenitiesId }: TContentCard) => {
  return (
    <Bounded className={cn("", className)}>
       <section className="flex my-9">
        <article className="basis-[70%]">
          <p className="leading-10">{description}</p>
          <Amenities amenitiesId={amenitiesId} />
        </article>
        <aside className="basis-[30%] p-2">
          <BookingCard />
        </aside>
      </section>
    </Bounded>
  );
};

export default ContentCard;
