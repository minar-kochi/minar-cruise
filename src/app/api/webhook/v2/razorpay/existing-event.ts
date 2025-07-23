import { FOUR_MINUTE, MAX_EVENT_RETRY_WEBHOOK_COUNT } from "@/constants/config";
import { createEventorThrow, UpdateFailedCount } from "@/db/data/dto/events";
import { isOlderThan } from "@/lib/utils";
import { Events } from "@prisma/client";
type TProcessEvent = {
  event: Events | null;
  eventId: string;
  metadata: any;
  payload: any;
};

type EVENT_ACTION =
  | "NEW_EVENT"
  | "RETRY"
  | "UNPROCESSABLE_CONTENT"
  | "EVENT_CREATION_FAILED"
  | "SUCCESS"
  | "PROCESSING";

type ReturnEvent = { event: Events };
type ReturnAction =
  | { action: "EVENT_CREATION_FAILED"; event: null }
  | ({ action: "NEW_EVENT" } & ReturnEvent)
  | ({ action: "RETRY" } & ReturnEvent)
  | ({ action: "UNPROCESSABLE_CONTENT" } & ReturnEvent)
  | ({ action: "SUCCESS" } & ReturnEvent)
  | ({ action: "PROCESSING" } & ReturnEvent);

export async function processEvent({
  event,
  eventId,
  metadata,
  payload,
}: TProcessEvent): Promise<ReturnAction> {
  if (!event) {
    try {
      const newEvent = await createEventorThrow({
        eventId,
        status: "PROCESSING",
        description: "Processing Booking information",
        metadata,
        payload,
      });
      if (!newEvent.id) {
        return { action: "EVENT_CREATION_FAILED", event: null };
      }

      return { action: "NEW_EVENT", event: newEvent };
    } catch (error) {
      return { action: "EVENT_CREATION_FAILED", event: null };
    }
  }

  switch (event.status) {
    case "FAILED": {
      if (event.FailedCount >= MAX_EVENT_RETRY_WEBHOOK_COUNT) {
        return {
          action: "UNPROCESSABLE_CONTENT",
          event,
        };
      }
      await UpdateFailedCount(event.id);
      return {
        action: "RETRY",
        event,
      };
    }
    case "PROCESSING": {
      // event got stuck! or failed to completed half way.
      const lastAttempt = event.lastProcessingAttempt;
      const isOlder = isOlderThan(lastAttempt, FOUR_MINUTE);
      if (isOlder) {
        // The request failed to create booking and update the event.
        // we are safe to retry the logic.
        return {
          action: "RETRY",
          event,
        };
      }
      return {
        action: "PROCESSING",
        event,
      };
    }
    case "SUCCESS": {
      return {
        action: "SUCCESS",
        event,
      };
    }
  }
}
