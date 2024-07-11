import { cn } from "@/lib/utils";

const CompanyInfoCard = ({ className }:{
  className: string
}) => {
  return (
    <section>
      <ul className={cn("flex flex-col gap-8 h-full ", className)}>
        <h2 className="max-sm:mx-auto text-2xl font-bold ">Company</h2>
        <li className="max-sm:mx-auto font-semibold text-slate-400">About Us</li>
        <li className="max-sm:mx-auto font-semibold text-slate-400">Packages</li>
        <li className="max-sm:mx-auto font-semibold text-slate-400">Facilities</li>
        <li className="max-sm:mx-auto font-semibold text-slate-400">News And Blogs</li>
      </ul>
    </section>
  );
};

export default CompanyInfoCard;
