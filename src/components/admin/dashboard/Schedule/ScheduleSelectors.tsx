import React from "react";
import ScheduleSelector from "./ScheduleSelector";

export default function ScheduleSelectors() {
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
            label="Sunset"
            key={`ScheduleSelector-type-sunset`}
            type="sunset"
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
