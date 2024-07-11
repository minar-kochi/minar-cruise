import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import SocialCard from "./SocialCard";

const SubscribeCard = ({ className }: { className: string }) => {
  return (
    <section className="flex flex-col max-sm:w-full">
      <form className={cn("h-full flex flex-col gap-8")} action="submit">
        <label className="font-bold text-2xl  max-sm:mx-auto">
          News Letter
        </label>
        <input
          type="text"
          placeholder="First Name"
          className="outline-none placeholder: bg-[#313041] border-b py-2 border-slate-500 hover:border-blue-400 "
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          className="outline-none placeholder: bg-[#313041] border-b py-2 border-slate-500  hover:border-blue-400"
          required
        />
        <Button type="submit">Subscribe</Button>
      </form>
      <SocialCard />
    </section>
  );
};

export default SubscribeCard;
