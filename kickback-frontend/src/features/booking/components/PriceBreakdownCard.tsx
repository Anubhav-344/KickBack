// src/features/booking/components/PriceBreakdownCard.tsx

interface PriceBreakdownCardProps {
  subtotal: number;
  discount: number;
  discountLabel?: string;
  tax: number;
  total: number;
}

export default function PriceBreakdownCard({
  subtotal,
  discount,
  discountLabel,
  tax,
  total,
}: PriceBreakdownCardProps) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5 lg:p-5">
      <Row label="Subtotal" value={`\u20B9${subtotal}`} />
      {discount > 0 && (
        <Row
          label={discountLabel ? `Discount (${discountLabel})` : "Discount"}
          value={`\u2212\u20B9${discount}`}
          valueClassName="text-state-available"
        />
      )}
      <Row label="Tax" value={`\u20B9${tax}`} />
      <div className="h-px bg-border-subtle my-2 lg:my-3" />
      <Row label="Total" value={`\u20B9${total}`} bold />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  valueClassName,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className={`flex justify-between py-1 lg:py-1.5 ${bold ? "mt-1" : ""}`}>
      <span className={bold ? "text-base lg:text-lg font-semibold text-text-primary" : "text-[13px] lg:text-[15px] text-text-secondary"}>
        {label}
      </span>
      <span
        className={`tabular-nums ${
          bold ? "text-xl lg:text-2xl font-semibold text-text-primary" : `text-[13px] lg:text-[15px] ${valueClassName ?? "text-text-primary"}`
        }`}
      >
        {value}
      </span>
    </div>
  );
}
