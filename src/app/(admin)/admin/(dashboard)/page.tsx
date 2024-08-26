import ScheduleSelector from "@/components/admin/dashboard/Schedule/ScheduleSelector";
import { Button } from "@/components/ui/button";
import { getManySchedulesAndTotalBookingCount } from "@/db/data/dto/schedule";
import Link from "next/link";

export default async function Admin() {
  const data = await getManySchedulesAndTotalBookingCount();
  return (
    <section className="">
      <h1 className="py-5 text-center font-bold">Welcome to Admin dashboard</h1>
      <article className="flex justify-center gap-4">
        <Link href={"/admin/schedule"}>
          <Button>Schedule</Button>
        </Link>
        <Link href={"/admin/booking"}>
          <Button>Booking</Button>
        </Link>
      </article>
    </section>
  );
}
