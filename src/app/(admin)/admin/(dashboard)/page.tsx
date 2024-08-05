import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Admin() {
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
