// src/features/auth/components/FaqList.tsx
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Faq } from "../data/faqs";

// Accordion: each question is a button that exposes aria-expanded and points
// at its answer panel with aria-controls. Several can be open at once.
export default function FaqList({ items }: { items: Faq[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <ul className="flex flex-col gap-2">
      {items.map((faq, i) => {
        const isOpen = open.has(i);
        const panelId = `${baseId}-panel-${i}`;
        return (
          <li
            key={faq.question}
            className="bg-bg-surface border border-border-subtle rounded-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-sm lg:text-base font-medium text-text-primary">
                {faq.question}
              </span>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className={`shrink-0 text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div id={panelId} hidden={!isOpen} className="px-4 pb-4 -mt-1">
              <p className="text-sm lg:text-base text-text-secondary">{faq.answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
