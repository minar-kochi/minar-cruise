import React from "react";
import ScheduleSelector from "./ScheduleSelector";

export default function ScheduleSelectors() {
  return (
    <div className="group-[.schedule-page]:grid gap-4 grid-cols-3">
      <div className="rounded-md  basis-full group-[.schedule-sheet]:border-b  group-[.schedule-page]:border-2 group-[.schedule-page]:max-w-[365px] p-4  w-full    py-2">
        <div className="">
          <ScheduleSelector
            label="Breakfast"
            key={`ScheduleSelector-type-breakfast`}
            type="breakfast"
          />
        </div>
      </div>{" "}
      <div className="group-[.schedule-page]:border-2  group-[.schedule-sheet]:border-b  rounded-md  basis-full w-full group-[.schedule-page]:max-w-[365px] p-4   py-2">
        <div className="">
          <ScheduleSelector
            label="Lunch"
            key={`ScheduleSelector-type-lunch`}
            type="lunch"
          />{" "}
        </div>
      </div>
      <div className="group-[.schedule-page]:border-2 group-[.schedule-sheet]:border-b rounded-md  basis-full w-full group-[.schedule-page]:max-w-[365px] p-4   py-2">
        <div className="">
          <ScheduleSelector
            label="Sunset"
            key={`ScheduleSelector-type-sunset`}
            type="sunset"
          />
        </div>
      </div>
      <div className="group-[.schedule-page]:border-2 group-[.schedule-sheet]:border-b rounded-md  basis-full w-full group-[.schedule-page]:max-w-[365px] p-4   py-2">
        <div className="">
          <ScheduleSelector
            label="Dinner"
            key={`ScheduleSelector-type-dinner`}
            type="dinner"
          />{" "}
        </div>
      </div>
      <div className="group-[.schedule-page]:border-2 group-[.schedule-sheet]:border-b rounded-md  basis-full w-full group-[.schedule-page]:max-w-[365px] p-4   py-2">
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
