import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.NODE_ENV === "production") {
    return `${process.env.DOMAIN as string}${path}`;
  } else {
    return `http://localhost:${process.env.PORT ?? 3002}${path}`;
  }
}
