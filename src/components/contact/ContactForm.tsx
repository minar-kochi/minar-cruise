"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "../ui/button";
import InputBox from "./InputBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ContactValidators,
  TContactValidators,
} from "@/lib/validators/ContactFormValidator";
import toast from "react-hot-toast";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const ContactForm = () => {
  const { register, handleSubmit } = useForm<TContactValidators>({
    resolver: zodResolver(ContactValidators),
  });
  const { mutate: contactAdmin } = trpc.contact.useMutation({
    onSuccess(data, variables, context) {
      toast.success("We will Reach out to you soon!");
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleFormSubmit = async (data: TContactValidators) => {
    try {
      if (!executeRecaptcha) {
        toast.success("Recaptcha hasn't Loaded Yet, Please try again.");
        return;
      }
      const token = await executeRecaptcha("booking-form");

      contactAdmin({ ...data, token });
    } catch (error) {
      toast.error("Failed to validated Recaptcha");
    }
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <InputBox
        {...register("name")}
        as={"input"}
        label="Your Name *"
        props={{
          required: true,
        }}
      />
      <InputBox {...register("phone")} label="Your Phone *" />
      <InputBox {...register("email")} label="Your Email *" />
      <InputBox
        {...register("description")}
        label="Your message (optional)"
        as={"textarea"}
        className="h-[200px]"
      />
      <Button className="max-w-[200px] w-full">Submit</Button>
    </form>
  );
};

export default ContactForm;
