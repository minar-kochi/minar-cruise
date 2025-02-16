"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  AdminLoginValidator,
  TAdminLoginValidator,
} from "@/lib/validators/adminLoginValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { loginAction } from "@/app/Actions/login";
import { useTransition } from "react";

// export const description =
//   "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export default function LoginComponent() {
  const { register, handleSubmit, reset, formState } =
    useForm<TAdminLoginValidator>({
      resolver: zodResolver(AdminLoginValidator),
    });
  const [isPending, startTransition] = useTransition();

  const handleLogin = async (formData: TAdminLoginValidator) => {
    try {
      startTransition(() => {
        loginAction(formData)
          .then((data) => {
            if (data && "error" in data) {
              let error = data.error;
              if (!error) {
                error = "Email or password is Invalid";
              }
              toast.error(error);
            }
            if (data?.success) {
              reset();
              toast.success(data.success);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Email or password is Invalid");
          });
      });
    } catch (error) {
      toast.error("Email or password is Invalid");
    }
  };
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit(handleLogin)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="m@example.com"
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="*********"
                {...register("password")}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block   relative">
        <div className="bg-blend-saturation">
          <Image
            src="/assets/minar-boat-dark.jpeg"
            alt="Image"
            width={1288}
            height={720}
            className="h-full w-full lg:p-12 max-h-[100dvh] md:object-cover lg:object-contain"
          />
        </div>
      </div>
    </div>
  );
}
