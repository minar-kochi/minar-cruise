"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { setIsModalOpen } from "@/lib/features/modal/modalSlice";
import ScheduleBar from "./ScheduleContainer";

export default function ScheduleBarWrapper() {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector((state) => state.modalStore);
  return (
    <Sheet
      key={"Sheet-modal-schedule-modal"}
      open={isModalOpen.isModalOpen}
      onOpenChange={(value) => dispatch(setIsModalOpen({ open: value }))}
    >
      <SheetContent
        side={"rightWithLargerWidth"}
        className="sm:max-w-lg max-w-full w-full overflow-scroll  scrollbar-w-2 scrollbar-track-orange-lighter scrollbar-thumb-rounded "
      >
        {/* <OpenScheduleButton /> */}
        <div className="group schedule-sheet h-full w-full">
          <ScheduleBar />
        </div>
      </SheetContent>
    </Sheet>
  );
}
