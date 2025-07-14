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
  payload,
  metadata,
}: {
  eventId: string;
  status: PROCESSING_STATUS;
  description?: string;
  payload?: any;
  metadata?: any;
}) {
  try {
    const createdEvents = await db.events.create({
      data: {
        eventId,
        status,
        description,
        lastProcessingAttempt: new Date(Date.now()),
        FailedCount: 0,
        payload: payload || null,
        metadata: metadata || null,
      },
    });
    return createdEvents;
  } catch (error) {
    ErrorLogger(error);
    throw new Error("Failed to create event");
  }
}

export async function updateEventToSucess({
  id,
  bookingId,
}: {
  id: string;
  bookingId: string;
}) {
  try {
    const updateData: any = {
      status: "SUCCESS" as PROCESSING_STATUS,
    };

    // Only add bookingId if provided
    if (bookingId) {
      updateData.bookingId = bookingId;
    }

    const updatedEvent = await db.events.update({
      where: {
        id: id,
      },
      data: updateData,
    });
    return updatedEvent;
  } catch (error) {
    ErrorLogger(error);
    throw new Error("Failed to update event to success");
  }
}

export async function updateEventToFailed({
  id,
  description,
  failedCountSetter,
  bookingId,
}: {
  id: string;
  description?: string;
  failedCountSetter?: number;
  bookingId?: string;
}) {
  try {
    const updateData: any = {
      status: "FAILED" as PROCESSING_STATUS,
    };

    if (description) {
      updateData.description = description;
    }

    if (failedCountSetter !== undefined) {
      updateData.FailedCount = {
        set: failedCountSetter,
      };
    }

    if (bookingId) {
      updateData.bookingId = bookingId;
    }

    const updatedEvent = await db.events.update({
      where: {
        id: id,
      },
      data: updateData,
    });
    return updatedEvent;
  } catch (error) {
    ErrorLogger(error);
    throw new Error("Failed to update event to failed");
  }
}

export async function UpdateFailedCount(id: string) {
  try {
    const data = await db.events.update({
      where: {
        id,
      },
      data: {
        status: "PROCESSING",
        FailedCount: {
          increment: 1,
        },
      },
    });
    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

// New function to update processing timestamp without incrementing failed count
export async function updateEventProcessingTimestamp(id: string) {
  try {
    const data = await db.events.update({
      where: {
        id,
      },
      data: {
        status: "PROCESSING",
        lastProcessingAttempt: new Date(),
      },
    });
    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

// New function to update event with booking relationship
export async function updateEventWithBooking({
  id,
  bookingId,
  status,
  description,
}: {
  id: string;
  bookingId: string;
  status?: PROCESSING_STATUS;
  description?: string;
}) {
  try {
    const updateData: any = {
      bookingId,
    };

    if (status) {
      updateData.status = status;
    }

    if (description) {
      updateData.description = description;
    }

    const updatedEvent = await db.events.update({
      where: {
        id,
      },
      data: updateData,
    });
    return updatedEvent;
  } catch (error) {
    ErrorLogger(error);
    throw new Error("Failed to update event with booking");
  }
}

// Function to get events by status for monitoring/cleanup
export async function getEventsByStatus(
  status: PROCESSING_STATUS,
  limit: number = 100,
) {
  try {
    const events = await db.events.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
    return events;
  } catch (error) {
    ErrorLogger(error);
    return [];
  }
}

// Function to get stuck events (PROCESSING for too long)
export async function getStuckEvents(olderThanMinutes: number = 10) {
  try {
    const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000);

    const stuckEvents = await db.events.findMany({
      where: {
        status: "PROCESSING",
        updatedAt: {
          lt: cutoffTime,
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    return stuckEvents;
  } catch (error) {
    ErrorLogger(error);
    return [];
  }
}

// Clean up old successful events (optional cleanup job)
export async function cleanupOldSuccessfulEvents(olderThanDays: number = 30) {
  try {
    const cutoffTime = new Date(
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000,
    );

    const deletedEvents = await db.events.deleteMany({
      where: {
        status: "SUCCESS",
        createdAt: {
          lt: cutoffTime,
        },
      },
    });

    return deletedEvents.count;
  } catch (error) {
    ErrorLogger(error);
    throw new Error("Failed to cleanup old events");
  }
}
