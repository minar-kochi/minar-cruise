import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export function ErrorLogger(error: unknown) {
  if (error instanceof PrismaClientValidationError) {
    console.log("Client validation Error");
    console.log("Issue:", error.message);
    return;
  }
  if (error instanceof PrismaClientUnknownRequestError) {
    console.log("Unknown client Request error");
    console.log(error.message);
    return;
  }
  if (error instanceof PrismaClientKnownRequestError) {
    console.log("Known client Request error");
    console.log(error.message);
    return;
  }
  if (error instanceof PrismaClientRustPanicError) {
    console.log("Prisma Engine Panic Error");
    console.log(error.message);
    return;
  }
}
