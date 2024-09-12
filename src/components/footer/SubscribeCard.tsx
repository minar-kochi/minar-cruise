'use client'

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import SocialCard from "./SocialCard";
import { trpc } from "@/app/_trpc/client";

const SubscribeCard = ({ className }: { className: string }) => {
  const { mutate:createSubscription } = trpc.user.createSubscription.useMutation({
    onMutate(){

    },
    onSuccess(){

    },
    onError(){

    }
  })
  return (
    <section className="flex flex-col max-sm:w-full">
      <form className={cn("h-full flex items-center flex-col gap-8")} action="submit">
        <label className="font-semibold text-2xl  max-sm:mx-auto">
          News Letter
        </label>
        <input
          type="text"
          placeholder="First Name"
          className="text-black outline-none placeholder:text-black/60 text-sm bg-[#D9D9D9] border-b py-1 pl-2 rounded-md border-slate-500 hover:border-blue-400 w-60 "
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          className="text-black outline-none placeholder:text-black/60 text-sm bg-[#D9D9D9] border-b py-1 pl-2 rounded-md border-slate-500  hover:border-blue-400 w-60"
          required
        />
        <Button className="bg-[#102539ee] h-9 w-32  hover:bg-[#0D3A62]" >Subscribe</Button>
      </form>
      <SocialCard />
    </section>
  );
};

export default SubscribeCard;
