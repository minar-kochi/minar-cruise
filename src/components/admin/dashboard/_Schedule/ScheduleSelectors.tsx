import React from "react";
import ScheduleSelector from "./ScheduleSelector";
import { trpc } from "@/app/_trpc/client";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import ScheduleSelectorLoader from "./Loader/ScheduleSelectorLoader";
import { getSchedulesByDateOrNow } from "@/db/data/dto/schedule";

export default function ScheduleSelectors() {
  /**
   * @TODO [AMJAD / Neil ]
   * Understand a bit more about react query and TRPC and impliment a Loading state.
   *
   */
  // const date = useAppSelector((state) => state.schedule.date);
  // if (isLoading || isFetching) {
  //   return (
  //     <div>
  //       <ScheduleSelectorLoader title="Breakfast" />
  //       <ScheduleSelectorLoader title="Lunch" />
  //       <ScheduleSelectorLoader title="Dinner" />
  //       <ScheduleSelectorLoader title="Custom" />
  //     </div>
  //   );
  // }
  return (
    <div>
      <ScheduleSelector
        label="Breakfast"
        key={`ScheduleSelector-type-breakfast`}
        type="breakfast"
      />
      <ScheduleSelector
        label="Lunch"
        key={`ScheduleSelector-type-lunch`}
        type="lunch"
      />
      <ScheduleSelector
        label="Dinner"
        key={`ScheduleSelector-type-dinner`}
        type="dinner"
      />
      <ScheduleSelector
        label="Custom"
        key={`ScheduleSelector-type-custom`}
        type="custom"
      />
    </div>
  );
}
