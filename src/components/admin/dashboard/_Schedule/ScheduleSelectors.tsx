import React from "react";
import ScheduleSelector from "./ScheduleSelector";

export default function ScheduleSelectors() {
  return (
    <div>
      <ScheduleSelector type="breakfast" />
      <ScheduleSelector type="lunch" />
      <ScheduleSelector type="dinner" />
      <ScheduleSelector type="custom" />
    </div>
  );
}
