import { cn } from "@/lib/utils";
import Link from "next/link";

const CompanyInfoCard = ({ className }: { className: string }) => {
  return (
    <section>
      <div className={cn("flex flex-col gap-8 h-full ", className)}>
        <h2 className="max-sm:mx-auto text-2xl font-semibold">Company</h2>
        <Link href="/about" className="max-sm:mx-auto font-medium text-white">
          About Us
        </Link>
        <Link
          href="/package/premium-cruise"
          className="max-sm:mx-auto font-medium text-white"
        >
          Packages
        </Link>
        <Link
          href="/facilities"
          className="max-sm:mx-auto font-medium text-white"
        >
          Facilities
        </Link>
        <Link href="/blogs/1" className="max-sm:mx-auto font-medium text-white">
          News And Blogs
        </Link>
      </div>
    </section>
  );
};

export default CompanyInfoCard;
