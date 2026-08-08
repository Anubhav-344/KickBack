// src/features/booking/types.ts

export interface OperatingWindow {
    openingMinutes: number; // minutes since midnight, e.g. 10 AM = 600
    closingMinutes: number; // may exceed 1440 if the café closes past midnight
    isClosed: boolean;
  }
  
  export interface ExistingBooking {
    startMinutes: number;
    endMinutes: number;
  }
  
  export type TimelineSegmentType = "booked" | "available" | "selected";
  
  export interface TimelineSegment {
    type: TimelineSegmentType;
    startMinutes: number;
    endMinutes: number;
  }
  