import {
  Amenities,
  FoodMenu,
  Package,
  Schedule,
  User,
  Image,
  Booking,
  PackageImage,
} from "@prisma/client";

export type bookingPartialId = (Omit<Booking, "id" | "createdAt"> & {
  id?: string;
})[];
export type packagesPartialId = (Omit<Package, "createdAt"> & {
  id?: string;
})[];
export type foodMenuPartialId = (Omit<FoodMenu, "id"> & { id?: string })[];
export type schedulePartialId = (Omit<Schedule, "id"> & { id?: string })[];
export type amenitiesPartialId = (Omit<Amenities, "id"> & { id?: string })[];
export type userPartialId = (Omit<User, "id"> & { id?: string })[];
export type imagesPartialId = (Omit<Image, "id"> & { id?: string })[];
export type packageImagePartialId = (Omit<PackageImage, "id"> & {
  id?: string;
})[];

import { amenities } from "./data/dbAmenities";
import { booking } from "./data/dbBooking";
import { foodMenu } from "./data/dbFoodMenu";
import { image } from "./data/DbImageData";
import { packageImage } from "./data/dbPackageImage";
import { packages } from "./data/dbPackage";
import { schedule } from "./data/dbSchedule";
import { users } from "./data/dbUserData";

export { amenities };
export { booking };
export { foodMenu };
export { image };
export { packageImage };
export { packages };
export { schedule };
export { users };
