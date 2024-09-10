import { cn } from "@/lib/utils";
import Link from "next/link";

const ExploreCard = ({ className }: { className: string }) => {
  return (
    <section>
      <ul className={cn("flex flex-col gap-8 h-full ", className)}>
        <h2 className="max-sm:mx-auto text-2xl font-semibold">Explore</h2>
        {/* <li className="max-sm:mx-auto font-semibold  text-white">
          Account
        </li> */}
        <li className="max-sm:mx-auto font-medium text-white">
          <Link href={"/privacy-policy"}>Privacy Policy</Link>
        </li>
        <li className="max-sm:mx-auto font-medium text-white">
          <Link href={"/terms-conditions"}>Terms And Conditions</Link>
        </li>
        <li className="max-sm:mx-auto font-medium text-white">
          <Link href={"/contact"}>Contact Us</Link>
        </li>
        <li className="max-sm:mx-auto font-medium text-white">
          <Link href={"/refund_returns"}>Refund Policy</Link>
        </li>
      </ul>
    </section>
  );
};

export default ExploreCard;
