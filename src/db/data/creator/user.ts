import { db } from "@/db";

export async function CreateUser({
  email,
  name,
  phone: contact,
}: {
  name: string;
  email?: string;
  phone?: string;
}) {
  try {
    const user = await db.user.create({
      data: {
        email,
        name,
        contact,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}
