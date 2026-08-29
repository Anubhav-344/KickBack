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
      <div className="bg-bg-surface border border-border-subtle rounded-card p-3.5">
        <Row label="Subtotal" value={`\u20B9${subtotal}`} />
        {discount > 0 && (
          <Row
            label={discountLabel ? `Discount (${discountLabel})` : "Discount"}
            value={`\u2212\u20B9${discount}`}
            valueClassName="text-state-available"
          />
        )}
        <Row label="Tax" value={`\u20B9${tax}`} />
        <div className="h-px bg-border-subtle my-2" />
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
      <div className={`flex justify-between py-1 ${bold ? "mt-1" : ""}`}>
        <span className={bold ? "text-base font-semibold text-text-primary" : "text-[13px] text-text-secondary"}>
          {label}
        </span>
        <span
          className={`tabular-nums ${
            bold ? "text-xl font-semibold text-text-primary" : `text-[13px] ${valueClassName ?? "text-text-primary"}`
          }`}
        >
          {value}
        </span>
      </div>
    );
  }
  