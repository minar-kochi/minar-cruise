import { cn } from "@/lib/utils";

const ExploreCard = ({ className }:{
  className: string
}) => {
  return (
    <section>
      <ul className={cn("flex flex-col gap-8 h-full ", className)}>
        <h2 className="max-sm:mx-auto text-2xl font-bold">Explore</h2>
        <li className="max-sm:mx-auto font-semibold  text-slate-400">Account</li>
        <li className="max-sm:mx-auto font-semibold text-slate-400">Privacy Policy</li>
        <li className="max-sm:mx-auto font-semibold text-slate-400">Terms And Conditions</li>
        <li className="max-sm:mx-auto font-semibold text-slate-400">Contact Us</li>
        <li className="max-sm:mx-auto font-semibold text-slate-400">Refund Policy</li>
      </ul>
    </section>
  );
};

export default ExploreCard;
