// src/features/auth/pages/MyTicketsPage.tsx
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import SettingsLayout from "../components/SettingsLayout";
import { useMyTickets, type TicketStatus } from "../hooks/useSupportTickets";

const STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const STATUS_CLASS: Record<TicketStatus, string> = {
  OPEN: "text-state-pending",
  IN_PROGRESS: "text-state-pending",
  RESOLVED: "text-state-available",
  CLOSED: "text-text-secondary",
};

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const { data: tickets, isLoading, isError } = useMyTickets();

  return (
    <SettingsLayout title="My tickets" backTo="/support" backLabel="Back to help and support">
      {isLoading && (
        <p role="status" className="text-sm text-text-secondary">
          Loading your tickets...
        </p>
      )}

      {isError && (
        <p role="alert" className="text-sm text-state-error">
          Couldn&apos;t load your tickets. Please try again.
        </p>
      )}

      {tickets && tickets.length === 0 && (
        <p className="text-sm text-text-secondary mb-5">You haven&apos;t raised any tickets yet.</p>
      )}

      {tickets && tickets.length > 0 && (
        <ul className="flex flex-col gap-3 mb-6">
          {tickets.map((t) => (
            <li
              key={t.ticketId}
              className="bg-bg-surface border border-border-subtle rounded-card px-4 py-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm lg:text-base font-medium text-text-primary">{t.subject}</p>
                <span className={`text-xs font-medium shrink-0 ${STATUS_CLASS[t.status]}`}>
                  {STATUS_LABEL[t.status]}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-1.5 line-clamp-3">{t.message}</p>
              <p className="text-xs text-text-secondary mt-2">
                #{t.ticketId} ·{" "}
                {new Date(t.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Button type="button" onClick={() => navigate("/support/tickets/new")}>
        Raise a ticket
      </Button>
    </SettingsLayout>
  );
}
