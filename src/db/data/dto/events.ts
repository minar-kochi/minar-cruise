import { db } from "@/db";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { PROCESSING_STATUS } from "@prisma/client";

export async function getEventById(eventId: string) {
  try {
    const data = await db.events.findFirst({
      where: {
        eventId,
      },
    });

    if (!data?.id) {
      return null;
    }
    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

export async function createEventorThrow({
  eventId,
  status,
  description,
}: {
  eventId: string;
  status: PROCESSING_STATUS;
  description?: string;
}) {
  try {
    const createdEvents = await db.events.create({
      data: {
        eventId,
        status,
        description,
        FailedCount: 0,
      },
    });
    return createdEvents;
  } catch (error) {
    ErrorLogger(error);
    throw new Error("Failed to create");
  }
}
export async function updateEventToSucess({ id }: { id: string }) {
  try {
    const createdEvents = await db.events.update({
      where: {
        id: id,
      },
      data: {
        status: "SUCCESS",
      },
    });
    return createdEvents;
  } catch (error) {
    ErrorLogger(error);
    throw new Error("Failed to create");
  }
}
export async function updateEventToFailed({
  id,
  description,
  failedCountSetter,
}: {
  id: string;
  description?: string;
  failedCountSetter?: number;
}) {
  try {
    let FailedCount = failedCountSetter
      ? {
          set: failedCountSetter,
        }
      : undefined;
    const updatedEvent = await db.events.update({
      where: {
        id: id,
      },
      data: {
        description,
        FailedCount,
        status: "FAILED",
      },
    });
    return updatedEvent;
  } catch (error) {
    ErrorLogger(error);
    throw new Error("Failed to create");
  }
}
export async function UpdateFailedCount(id: string) {
  try {
    const data = await db.events.update({
      where: {
        id,
      },
      data: {
        FailedCount: {
          increment: 1,
        },
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function ThrowTemplate(number: number) {
  try {
    if (number === 2) {
      return { id: 1 };
    }
    console.log("Throw Template errored", number);
    throw new Error("something went wrong");
  } catch (error) {
    throw new Error("Failed to create");
  }
}
