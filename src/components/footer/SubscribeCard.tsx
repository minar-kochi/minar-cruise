"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import SocialCard from "./SocialCard";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SubscriptionFormValidator,
  TSubscriptionFormValidator,
} from "@/lib/validators/ContactFormValidator";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const SubscribeCard = ({ className }: { className: string }) => {
  const { mutate: createSubscription } =
    trpc.user.createSubscription.useMutation({
      onSuccess() {
        toast.success("You have subscribed to our News letters.");
      },
      onError() {
        toast.error("Something went wrong!");
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSubscriptionFormValidator>({
    resolver: zodResolver(SubscriptionFormValidator),
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const handleFormSubmit = async (data: TSubscriptionFormValidator) => {
    try {
      const token =
        executeRecaptcha && (await executeRecaptcha("OrderSubmitted"));
      if (!token) {
        toast.error("Recaptcha has not loaded Yet");
        return;
      }
      createSubscription(data);
    } catch (error) {}
  };
  return (
    <section className="flex flex-col max-sm:w-full">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={cn("h-full flex items-center flex-col gap-8")}
      >
        <label className="font-semibold text-2xl  max-sm:mx-auto">
          News Letter
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="Name"
          className="text-black outline-none placeholder:text-black/60 text-sm bg-[#D9D9D9] border-b py-1 pl-2 rounded-md border-slate-500 hover:border-blue-400 w-60 "
          required
        />
        <input
          type="email"
          {...register("email")}
          placeholder="Email Address"
          className="text-black outline-none placeholder:text-black/60 text-sm bg-[#D9D9D9] border-b py-1 pl-2 rounded-md border-slate-500  hover:border-blue-400 w-60"
          required
        />
        <Button className="bg-[#102539ee] h-9 w-32  hover:bg-[#0D3A62]">
          Subscribe
        </Button>
      </form>
      <SocialCard />
    </section>
  );
};

export default SubscribeCard;
