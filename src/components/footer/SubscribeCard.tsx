import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import SocialCard from "./SocialCard";

const SubscribeCard = ({ className }: { className: string }) => {
  return (
    <section className="flex flex-col max-sm:w-full">
      <form className={cn("h-full flex items-center flex-col gap-8")} action="submit">
        <label className="font-semibold text-2xl  max-sm:mx-auto">
          News Letter
        </label>
        <input
          type="text"
          placeholder="First Name"
          className="outline-none placeholder:text-black/60 text-sm bg-[#D9D9D9] border-b py-1 pl-2 rounded-md border-slate-500 hover:border-blue-400 w-60 "
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          className="outline-none placeholder:text-black/60 text-sm bg-[#D9D9D9] border-b py-1 pl-2 rounded-md border-slate-500  hover:border-blue-400 w-60"
          required
        />
        <Button type="submit" className="bg-[#102539ee] h-9 w-32  hover:bg-[#0D3A62] ">Subscribe</Button>
      </form>
      <SocialCard />
    </section>
  );
};

export default SubscribeCard;
