// src/features/auth/hooks/useSupportTickets.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/app/axiosClient";

export type TicketCategory = "BOOKING" | "PAYMENT" | "ACCOUNT" | "OTHER";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportTicket {
  ticketId: number;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  bookingId: number | null;
  createdAt: string;
}

export interface CreateTicketInput {
  category: TicketCategory;
  subject: string;
  message: string;
  bookingId?: number;
}

// LIVE — GET /api/support/tickets (the caller's own tickets, newest first)
export function useMyTickets() {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: () =>
      axiosClient.get<SupportTicket[]>("/support/tickets").then((res) => res.data),
  });
}

// LIVE — POST /api/support/tickets  (201; 422 = too many open tickets)
export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTicketInput) =>
      axiosClient.post<SupportTicket>("/support/tickets", input).then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["support-tickets"] }),
  });
}
