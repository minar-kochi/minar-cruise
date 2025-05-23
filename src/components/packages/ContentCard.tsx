// import Bounded from "../elements/Bounded";
// import { cn } from "@/lib/utils";
// import { Amenities } from "./Amenities";
// import BookingCard from "./BookingFormCard";
// import { TGetPackageById } from "@/db/data/dto/package";
// import { MDXRemote } from "next-mdx-remote/rsc";
// import BookingFormCard from "./BookingFormCard";
// import { Suspense } from "react";
// import { Loader2 } from "lucide-react";
// import UserBookingDateSelector from "./UserBookingDateSelector";

// type TContentCard = {
//   className?: string;
//   description: string;
//   amenitiesId: string;
//   formData: TGetPackageById;
// };

// const ContentCard = async ({
//   className,
//   description,
//   amenitiesId,
//   formData,
// }: TContentCard) => {
//   return (
//     <Bounded className={cn("flex justify-between py-12", className)}>
//       <article className="">
//         <MDXRemote source={description} />
//         <Amenities amenitiesId={amenitiesId} />
//       </article>
//       {formData.packageCategory === "CUSTOM" ||
//       formData.packageCategory === "EXCLUSIVE" ? (
//         <></>
//       ) : (
//         <UserBookingDateSelector
//           packageCategory={formData.packageCategory}
//           packageId={formData.id}
//           packageTitle={formData.title}
//           packagePrice={{
//             adult: formData.adultPrice,
//             child: formData.childPrice,
//           }}
//         />
//       )}
//     </Bounded>
//   );
// };

// export default ContentCard;
