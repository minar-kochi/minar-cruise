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

const ContactForm = () => {
  const { register, handleSubmit } = useForm<TContactValidators>({
    resolver: zodResolver(ContactValidators),
  });
  const { mutate: contactAdmin } = trpc.contact.useMutation({
    onSuccess(data, variables, context) {
      toast.success("We will Reach out to you soon!");
    },
    onError(error, variables, context) {
      toast.error("something went wrong!");
    },
  });
  const handleFormSubmit = (data: TContactValidators) => {
    contactAdmin(data);
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
      <Button>Submit</Button>
    </form>
  );
};

export default ContactForm;
