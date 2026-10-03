import { FREE_SHIPPING_THRESHOLD } from "@/lib/cart-math";
import type { CartSummary } from "@/lib/cart-math";
import { formatMoney } from "@/lib/format";

export function CartTotals({ summary }: { summary: CartSummary }) {
  const progress =
    summary.subtotal <= 0
      ? 0
      : Math.min(100, (summary.subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = summary.subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="space-y-4">
      {unlocked ? (
        <p className="text-sm">Delivery is free on this bag.</p>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground">
            Add {formatMoney(summary.remainingForFreeShipping)} for free delivery.
          </p>
          <div
            className="mt-2 h-1 bg-muted"
            role="meter"
            aria-label="Progress toward free delivery"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatMoney(summary.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Delivery</dt>
          <dd className="tabular-nums">
            {summary.shipping === 0 ? "Free" : formatMoney(summary.shipping)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 text-muted-foreground">
          <dt>VAT included</dt>
          <dd className="tabular-nums">{formatMoney(summary.vat)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3 text-base font-medium">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(summary.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
