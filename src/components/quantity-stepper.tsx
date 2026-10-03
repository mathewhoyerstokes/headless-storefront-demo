"use client";

import { Button } from "@/components/ui/button";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
}: {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className="inline-flex items-center border border-border bg-card">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-none"
        aria-label={`Decrease quantity of ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </Button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-none"
        aria-label={`Increase quantity of ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
    </div>
  );
}
