import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Admin() {
  return (
    <section className="">
      <h1 className="text-center font-bold py-5">Welcome to dashboard</h1>
      <article className="flex justify-center gap-4">
        <Link href={'/admin/schedule'}>
          <Button>Schedule</Button>
        </Link>
        <Link href={'/admin/schedule'}>
          <Button>Bookings</Button>
        </Link>
      </article>
    </section>
  );
}
