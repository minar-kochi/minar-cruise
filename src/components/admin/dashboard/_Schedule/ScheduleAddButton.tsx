import { Check } from "lucide-react";
import React from "react";

export default function ScheduleAddButton() {
  return (
    <button
      //   onClick={handleCreateSchedule}
      className="p-2  border rounded-xl hover:bg-secondary"
    >
      {/* {isLoading ? (
        <>
          <Loader2 className="h-5  w-5 animate-spin" />
        </>
      ) : (
        <Check className="h-5  w-5" />
      )} */}
      <Check className="h-5  w-5" />
    </button>
  );
}
