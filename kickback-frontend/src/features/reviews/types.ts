// src/features/reviews/types.ts

export interface Review {
    reviewId: number;
    rating: number; // 1-5
    comment?: string;
    reviewerName: string;
    createdAt: string; // ISO date
  }
  