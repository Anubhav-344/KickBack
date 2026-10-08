// src/features/auth/pages/NewTicketPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ticketSchema, type TicketFormValues } from "@/lib/validators";
import SettingsLayout from "../components/SettingsLayout";
import { useCreateTicket } from "../hooks/useSupportTickets";
import { useUserBookings } from "../hooks/useUserBookings";

const CATEGORIES = [
  { value: "BOOKING", label: "A booking" },
  { value: "PAYMENT", label: "A payment" },
  { value: "ACCOUNT", label: "My account" },
  { value: "OTHER", label: "Something else" },
] as const;

const fieldClass =
  "w-full bg-bg-surface border border-border-strong rounded-card px-3.5 py-3 text-sm lg:text-base text-text-primary placeholder:text-text-secondary";

function bookingLabel(b: { cafeName: string; resourceName: string; startTimestamp: string }) {
  const when = new Date(b.startTimestamp).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${b.cafeName}, ${b.resourceName}, ${when}`;
}

export default function NewTicketPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createTicket = useCreateTicket();
  const { data: bookings } = useUserBookings();

  const preselected = searchParams.get("booking") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: "BOOKING",
      subject: "",
      message: "",
      bookingId: preselected,
    },
  });

  const onSubmit = (values: TicketFormValues) => {
    createTicket.mutate(
      {
        category: values.category,
        subject: values.subject.trim(),
        message: values.message.trim(),
        bookingId: values.bookingId ? Number(values.bookingId) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Ticket raised. We'll get back to you by email.");
          navigate("/support/tickets", { replace: true });
        },
        onError: (error) => {
          const status = isAxiosError(error) ? error.response?.status : undefined;
          if (status === 422) {
            toast.error("You have too many open tickets. Wait for a reply before raising another.");
          } else if (status === undefined || status < 500) {
            toast.error("Couldn't raise the ticket. Please try again.");
          }
        },
      },
    );
  };

  return (
    <SettingsLayout title="Raise a ticket" backTo="/support" backLabel="Back to help and support">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-5">
          <label htmlFor="ticket-category" className="block text-sm text-text-secondary mb-2">
            What is it about?
          </label>
          <select id="ticket-category" className={fieldClass} {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {bookings && bookings.length > 0 && (
          <div className="mb-5">
            <label htmlFor="ticket-booking" className="block text-sm text-text-secondary mb-2">
              Which booking? (optional)
            </label>
            <select id="ticket-booking" className={fieldClass} {...register("bookingId")}>
              <option value="">Not about a specific booking</option>
              {bookings.map((b) => (
                <option key={b.bookingId} value={b.bookingId}>
                  {bookingLabel(b)}
                </option>
              ))}
            </select>
          </div>
        )}

        <Input
          label="Subject"
          placeholder="Short summary"
          maxLength={150}
          {...register("subject")}
          error={errors.subject?.message}
        />

        <div className="mb-5">
          <label htmlFor="ticket-message" className="block text-sm text-text-secondary mb-2">
            Describe the problem
          </label>
          <textarea
            id="ticket-message"
            rows={6}
            maxLength={2000}
            placeholder="What happened, and what did you expect?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "ticket-message-error" : undefined}
            className={`${fieldClass} resize-none`}
            {...register("message")}
          />
          {errors.message && (
            <p id="ticket-message-error" role="alert" className="text-state-error text-xs mt-1.5">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          isLoading={createTicket.isPending}
          loadingText="Sending..."
        >
          Submit ticket
        </Button>
      </form>
    </SettingsLayout>
  );
}
