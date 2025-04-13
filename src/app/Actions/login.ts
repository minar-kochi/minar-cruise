"use server";
import { signIn } from "@/auth/auth";
import {
  AdminLoginValidator,
  TAdminLoginValidator,
} from "@/lib/validators/adminLoginValidator";
import { AccessDenied } from "@auth/core/errors";
export const loginAction = async (formData: TAdminLoginValidator) => {
  try {
    const data = AdminLoginValidator.safeParse(formData);
    if (data.error) {
      console.log("errored");
      return { error: "Failed to authenticate" };
    }
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: true,
      redirectTo: "/admin",
    });
    console.log("success");
    return { success: "Authentication Sucessfull" };
  } catch (error) {
    if (error instanceof AccessDenied) {
      return { error: "Failed to receive access" };
    }
    throw error;
  }
};
