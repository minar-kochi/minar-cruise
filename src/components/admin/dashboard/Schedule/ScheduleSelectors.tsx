import React from "react";
import ScheduleSelector from "./ScheduleSelector";

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
      <div className="border-y   py-2">
        <div className="">
          <ScheduleSelector
            label="Breakfast"
            key={`ScheduleSelector-type-breakfast`}
            type="breakfast"
          />
        </div>
      </div>{" "}
      <div className="border-b   py-2">
        <div className="">
          <ScheduleSelector
            label="Lunch"
            key={`ScheduleSelector-type-lunch`}
            type="lunch"
          />{" "}
        </div>
      </div>
      <div className="border-b   py-2">
        <div className="">
          <ScheduleSelector
            label="Dinner"
            key={`ScheduleSelector-type-dinner`}
            type="dinner"
          />{" "}
        </div>
      </div>
      <div className="border-b   py-2">
        <div className="">
          <ScheduleSelector
            label="Custom"
            key={`ScheduleSelector-type-custom`}
            type="custom"
          />{" "}
        </div>
      </div>
    </div>
  );
}
