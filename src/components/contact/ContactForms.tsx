// "use client";
// import {
//   ContactValidators,
//   TContactValidators,
// } from "@/lib/validators/ContactFormValidators";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import { Input } from "postcss";
// import { trpc } from "@/app/_trpc/client";
// import { cn } from "@/lib/utils";

// import { Loader2 } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React from "react";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import Overlay from "./Overlay";
// import { Button, buttonVariants } from "./ui/button";
// import { Checkbox } from "./ui/checkbox";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { Textarea } from "./ui/textarea";
// const ContactForm = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     getValues,
//     setValue,
//   } = useForm<TContactValidators>({
//     resolver: zodResolver(ContactValidators),
//   });

//   const router = useRouter();
//   const { mutate: handleFormSubmit, isLoading } =
//     trpc.sendContactForm.useMutation({
//       onError({ message }) {
//         if (message) return toast.error(message);
//         return toast.error("Ceva nu a funcționat, te rugăm să reîncerci!");
//       },
//       onSuccess: async (data) => {
//         setTimeout(() => {
//           if (typeof data?.sucess === "string" && data?.sucess) {
//             router.push(`/contact/thank-you?sendId=${data.sucess}`);
//           }
//         });
//       },
//     });

//   const { executeRecaptcha } = useGoogleReCaptcha();
//   const handleSumitForm = async (formdata: TContactValidators) => {
//     if (!executeRecaptcha) {
//       return toast.info("Recaptcha Has not Loaded yet!");
//     }
//     const gReCaptchaToken = (await executeRecaptcha("inquirySubmit")) as string;
//     handleFormSubmit({
//       ...formdata,
//       Gparsed: gReCaptchaToken,
//     });
//   };

//   return (
//     <div>
//       <div>
//         <Overlay GradientElementClassName="" TopclassName=" -top-32" />
//         <form onSubmit={handleSubmit(handleSumitForm)}>
//           <div className=" mx-auto mt-10 max-w-2xl">
//             <div className="block sm:flex gap-2  justify-center w-full">
//               <div className="grid w-full  items-center gap-1.5 mt-2">
//                 <Label
//                   className="pl-1 text-sm text-zinc-700 "
//                   htmlFor="LastName"
//                 >
//                   Prenume*
//                 </Label>
//                 <Input
//                   id="LastName"
//                   {...register("LastName")}
//                   placeholder=" prenume"
//                   className={cn(" text-sm", {
//                     "border-destructive focus-visible:ring-destructive":
//                       errors.LastName,
//                   })}
//                 />
//                 <p className="text-red-500 font-medium h-4">
//                   {errors.LastName ? errors.LastName.message : null}
//                 </p>
//               </div>
//               <div className="grid w-full  items-center gap-1.5 mt-2">
//                 <Label
//                   className="pl-1 text-sm text-zinc-700"
//                   htmlFor="userName"
//                 >
//                   Nume*
//                 </Label>
//                 <Input
//                   id="userName"
//                   {...register("FirstName")}
//                   placeholder="nume"
//                   className={cn(" text-sm", {
//                     "border-destructive focus-visible:ring-destructive":
//                       errors.FirstName,
//                   })}
//                 />
//                 <p className="text-red-500 font-medium h-4">
//                   {errors.FirstName ? errors.FirstName.message : null}
//                 </p>
//               </div>
//             </div>
//             <div className="sm:flex gap-2 mt-2 justify-center w-full">
//               <div className="grid w-full  items-center gap-1.5 mt-1">
//                 <Label
//                   className="pl-1 text-sm text-zinc-700"
//                   htmlFor="email_id"
//                 >
//                   Email*
//                 </Label>
//                 <Input
//                   id="email_id"
//                   {...register("email_id")}
//                   placeholder="adresa de email"
//                   className={cn(" text-sm", {
//                     "border-destructive focus-visible:ring-destructive":
//                       errors.email_id,
//                   })}
//                 />
//                 <p className="text-red-500 font-medium h-4">
//                   {errors.email_id ? errors.email_id.message : null}
//                 </p>
//               </div>
//               <div className="grid w-full  items-center gap-1.5 mt-1">
//                 <Label className="pl-1 text-sm text-zinc-700" htmlFor="contact">
//                   Telefon
//                 </Label>
//                 <Input
//                   id="contact"
//                   {...register("contact")}
//                   placeholder="numar de telefon"
//                   className={cn(" text-sm", {
//                     "border-destructive focus-visible:ring-destructive":
//                       errors.contact,
//                     // "": true,
//                   })}
//                 />
//                 <p className="text-red-500 font-medium h-4">
//                   {errors.contact ? errors.contact.message : null}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className=" mx-auto max-w-2xl mt-1.5">
//             <div className="grid w-full  items-center gap-1.5 mt-1">
//               <Label className="pl-1 text-sm text-zinc-700" htmlFor="LastName">
//                 Mesaj
//               </Label>
//               <Textarea
//                 {...register("description")}
//                 className="text-sm resize-none"
//                 placeholder="mesajul tau..."
//                 minRows={6}
//               />
//               <p className="text-red-500 font-medium h-4">
//                 {errors.description ? errors.description.message : null}
//               </p>
//             </div>
//           </div>
//           <div className="mx-auto max-w-2xl pt-3">
//             <div className="flex items-start mt-1 gap-2 ">
//               <Checkbox
//                 id="isNewsLetter"
//                 {...register("isNewsLetter", {
//                   value: "true",
//                 })}
//                 className={cn(
//                   "mt-0 h-5 w-5 data-[state=checked]:bg-white-500  bg-gray-50 border  data-[state=checked]:text-gray-900"
//                 )}
//                 checked
//                 value={getValues("isNewsLetter")}
//                 onCheckedChange={(e) => {
//                   setValue("isNewsLetter", e ? "true" : "false");
//                 }}
//               />
//               <Label className="text-sm text-zinc-500" htmlFor="isNewsLetter">
//                 Sunt de acord să primesc mesaje comerciale de la qoop cu
//                 ultimele noutăți și oferte.
//               </Label>
//             </div>
//             <div className=" ">
//               <Label
//                 className="flex items-start mt-1 gap-2 text-sm  text-zinc-500"
//                 htmlFor="TermsAndCondition"
//               >
//                 <Checkbox
//                   id="TermsAndCondition"
//                   {...register("TermsAndCondition", {
//                     value: "false",
//                   })}
//                   className={cn(
//                     "mt-0 h-5 w-5 data-[state=checked]:bg-white-500  bg-gray-50 border  data-[state=checked]:text-gray-900",
//                     {
//                       "border-red-500  border-2":
//                         errors.TermsAndCondition?.message,
//                     }
//                   )}
//                   value={getValues("TermsAndCondition")}
//                   onCheckedChange={(e) => {
//                     setValue("TermsAndCondition", e ? "true" : "false");
//                   }}
//                 />

//                 <p className=" leading-1">
//                   Am citit și am acceptat
//                   <Link
//                     href="/info/terms"
//                     className="hover:border-b border-black text-gray-900"
//                   >
//                     {" "}
//                     Termenii și Condițiile{" "}
//                   </Link>
//                   qoop
//                 </p>
//               </Label>
//             </div>
//             <div className="flex items-start gap-2 ">
//               <Label
//                 className="flex items-start mt-1 gap-2 text-sm  text-zinc-500"
//                 htmlFor="gdpr"
//               >
//                 <Checkbox
//                   id="gdpr"
//                   {...register("GDPR", {
//                     value: "false",
//                   })}
//                   className={cn(
//                     "h-5 w-5 data-[state=checked]:bg-white-500       data-[state=checked]:text-gray-900 ",
//                     {
//                       "border-red-500  border-2": errors.GDPR,
//                     }
//                   )}
//                   value={getValues("GDPR")}
//                   onCheckedChange={(e) => {
//                     setValue("GDPR", e ? "true" : "false");
//                   }}
//                 />
//                 <p className="">
//                   Am citit și am acceptat
//                   <Link
//                     href="/info/gdpr"
//                     className="hover:border-b border-black text-gray-900"
//                   >
//                     {" "}
//                     Politica de Confidențialitate{" "}
//                   </Link>
//                   qoop
//                 </p>
//               </Label>
//             </div>
//             <div className="flex items-start mt-4 gap-2">
//               <Label className="pl-7 text-sm text-zinc-500" htmlFor="gdpr">
//                 qoop.ro este protejat de reCAPTCHA și de către Google.
//                 <Link
//                   href={"https://policies.google.com/privacy?hl=ro"}
//                   className={"hover:border-b border-black text-gray-900 "}
//                 >
//                   {" "}
//                   Politici{" "}
//                 </Link>
//                 și
//                 <Link
//                   href={"https://policies.google.com/terms?hl=ro"}
//                   className={"hover:border-b border-black text-gray-900"}
//                 >
//                   {" "}
//                   Termeni{" "}
//                 </Link>{" "}
//                 pot fi aplicați.
//               </Label>
//             </div>
//           </div>
//           <div className="flex items-center justify-center">
//             <Button
//               disabled={isLoading || isSubmitting}
//               className="mt-8  text-sm px-12"
//             >
//               {isLoading || isSubmitting ? (
//                 <span className="flex gap-2">
//                   Trimitere
//                   <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
//                 </span>
//               ) : (
//                 <span>Trimite</span>
//               )}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ContactForm;
