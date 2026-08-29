// src/features/payment/components/PaymentMethodPicker.tsx
import { Smartphone, CreditCard, Landmark, Wallet } from "lucide-react";
import type { PaymentMethod } from "../types";

const OPTIONS: { value: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { value: "UPI", label: "UPI", icon: Smartphone },
  { value: "CARD", label: "Card", icon: CreditCard },
  { value: "NET_BANKING", label: "Net Banking", icon: Landmark },
  { value: "WALLET", label: "Wallet", icon: Wallet },
];

interface PaymentMethodPickerProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodPicker({ selected, onSelect }: PaymentMethodPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isSelected = value === selected;
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isSelected
                ? "border-accent bg-accent/10 text-text-primary"
                : "border-border-subtle bg-bg-surface text-text-primary"
            }`}
          >
            <Icon size={15} className={isSelected ? "text-accent" : "text-text-secondary"} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
