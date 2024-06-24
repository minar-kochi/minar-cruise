import Bounded from "../elements/Bounded";
import BookingCard from "./BookingCard";
import PackageDescription from "./PackageDescription";

const BookingSection = () => {
  return <Bounded className="md:flex max-md:flex-col gap-2">
		<PackageDescription className="md:basis-[70%] border"/>
		<BookingCard className="md:basis-[30%] border"/>
	</Bounded>;
};

export default BookingSection;
