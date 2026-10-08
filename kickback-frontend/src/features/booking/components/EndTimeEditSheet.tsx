// src/features/booking/components/EndTimeEditSheet.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import CenteredModal from "@/components/ui/CenteredModal";
import Button from "@/components/ui/Button";
import { minutesToParts, partsToMinutes } from "@/lib/dateTime";
import { AmPmToggle, TimeStepperBlock } from "./TimeControls";

interface EndTimeEditSheetProps {
  currentEndMinutes: number;
  onConfirm: (endMinutes: number) => void;
  trigger: ReactNode;
}

// Lets the user edit End Time directly instead of only adjusting Duration.
// Edits are local to this sheet until "Done" is pressed — onConfirm then
// calls the store's setEndMinutes(), which recomputes Duration from the
// gap to Start Time (snapped to a valid 15-min step). Nothing commits if
// the sheet is dismissed without confirming.
export default function EndTimeEditSheet({
  currentEndMinutes,
  onConfirm,
  trigger,
}: EndTimeEditSheetProps) {
  // Separate open states for the mobile sheet and the desktop modal: both
  // render in a portal, so sharing one flag would open both (see CenteredModal).
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [draftMinutes, setDraftMinutes] = useState(currentEndMinutes);

  const { hour12, minute, isPM } = minutesToParts(draftMinutes);

  const adjustHour = (delta: number) => {
    let next = hour12 + delta;
    if (next > 12) next = 1;
    if (next < 1) next = 12;
    setDraftMinutes(partsToMinutes(next, minute, isPM));
  };

  const adjustMinute = (delta: number) => {
    let next = minute + delta;
    if (next > 59) next = 0;
    if (next < 0) next = 59;
    setDraftMinutes(partsToMinutes(hour12, next, isPM));
  };

  const setAmPm = (pm: boolean) => setDraftMinutes(partsToMinutes(hour12, minute, pm));

  const setHour = (n: number) => setDraftMinutes(partsToMinutes(n, minute, isPM));
  const setMinute = (n: number) => setDraftMinutes(partsToMinutes(hour12, n, isPM));

  const resetDraft = () => setDraftMinutes(currentEndMinutes); // fresh each time it opens

  const body = (
    <>
      <div className="flex gap-2 mb-5">
        <TimeStepperBlock
          label="HOUR"
          spokenLabel="hour"
          value={String(hour12).padStart(2, "0")}
          onDecrement={() => adjustHour(-1)}
          onIncrement={() => adjustHour(1)}
          onSet={setHour}
          min={1}
          max={12}
        />
        <TimeStepperBlock
          label="MIN"
          spokenLabel="minute"
          value={String(minute).padStart(2, "0")}
          onDecrement={() => adjustMinute(-1)}
          onIncrement={() => adjustMinute(1)}
          onSet={setMinute}
          min={0}
          max={59}
        />
        <AmPmToggle isPM={isPM} onChange={setAmPm} />
      </div>

      <Button
        onClick={() => {
          onConfirm(draftMinutes);
          setSheetOpen(false);
          setModalOpen(false);
        }}
      >
        Done
      </Button>
    </>
  );

  return (
    <>
      {/* Mobile/tablet: bottom sheet */}
      <div className="contents lg:hidden">
        <BottomSheet
          open={sheetOpen}
          onOpenChange={(next) => {
            if (next) resetDraft();
            setSheetOpen(next);
          }}
          title="Set end time"
          trigger={trigger}
        >
          {body}
        </BottomSheet>
      </div>

      {/* Desktop: centered modal */}
      <div className="hidden lg:contents">
        <CenteredModal
          open={modalOpen}
          onOpenChange={(next) => {
            if (next) resetDraft();
            setModalOpen(next);
          }}
          title="Set end time"
          trigger={trigger}
          size="sm"
        >
          {body}
        </CenteredModal>
      </div>
    </>
  );
}