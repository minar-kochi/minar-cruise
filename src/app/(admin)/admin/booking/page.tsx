"use client";

import CustomCard from "@/components/custom/CustomCard";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import Link from "next/link";

const AdminBookingPage = () => {
  const data = useAppSelector((state) => state.schedule.date);
  return (
    <div className="w-full  min-h-[calc(100dvh-4rem)] bg-stone-800">
      <h1 className="font-bold text-3xl py-10  flex justify-center ">
        Welcome to Booking Section
      </h1>
      <div className="p-10 flex flex-wrap ">
        <Link href={"/admin/booking/offlineBooking"}>
          <CustomCard label="Add Offline Booking" className="" />
        </Link>
        <Link href={"/admin/booking/updateBooking"}>
          <CustomCard label="Update Booking" className="" />
        </Link>
        <Link href={"/admin/booking/changeBooking"}>
          <CustomCard label="Change Booking" className="" />
        </Link>
      </div>
    </div>
  );
};

export default AdminBookingPage;
