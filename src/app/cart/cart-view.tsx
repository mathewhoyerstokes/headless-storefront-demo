"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartTotals } from "@/components/cart-summary";
import { QuantityStepper } from "@/components/quantity-stepper";
import { useCart } from "@/components/cart-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type PlacedOrder = {
  id: string;
  name: string;
  email: string;
  total: number;
  itemCount: number;
};

export function CartView() {
  const { items, summary, setQuantity, removeItem, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  if (order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          Order {order.id}
        </p>
        <h1 className="font-display mt-3 text-4xl sm:text-5xl">Request received.</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {order.name}, this concept order for {order.itemCount}{" "}
          {order.itemCount === 1 ? "object" : "objects"} totals {formatMoney(order.total)}.
          A note would go to {order.email}. No payment was taken.
        </p>
        <Link href="/shop" className={cn(buttonVariants({ className: "mt-8 h-11 px-5" }))}>
          Back to the edit
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl sm:text-5xl">Your bag is empty.</h1>
        <p className="mt-4 text-muted-foreground">
          Add something from the edit. Quantities and the total stay on this device.
        </p>
        <Link href="/shop" className={cn(buttonVariants({ className: "mt-8 h-11 px-5" }))}>
          Browse the edit
        </Link>
      </div>
    );
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: { name?: string; email?: string } = {};
    if (name.trim().length < 2) nextErrors.name = "Add the name for the delivery note.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Add an email so the note has somewhere to go.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const placed: PlacedOrder = {
      id: `KN-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim(),
      total: summary.total,
      itemCount: summary.itemCount,
    };
    clear();
    setOrder(placed);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-4xl sm:text-5xl">Your bag</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {summary.itemCount} {summary.itemCount === 1 ? "object" : "objects"}. Change
        quantities here — the total updates with them.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <ul className="space-y-6">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 border-b border-border pb-6">
              <Link
                href={`/product/${item.productId}`}
                className="relative size-24 shrink-0 overflow-hidden bg-muted sm:size-28"
              >
                <Image
                  src={item.product.image}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                      {item.product.category}
                    </p>
                    <Link
                      href={`/product/${item.productId}`}
                      className="font-display text-2xl leading-tight hover:text-clay"
                    >
                      {item.product.name}
                    </Link>
                  </div>
                  <p className="text-sm tabular-nums">
                    {formatMoney(item.product.price * item.quantity)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                  {formatMoney(item.product.price)} each
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <QuantityStepper
                    value={item.quantity}
                    max={item.product.stock}
                    label={item.product.name}
                    onChange={(quantity) => setQuantity(item.productId, quantity)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Delivery note</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A concept checkout. We keep the total honest and skip the payment step.
          </p>
          <form className="mt-6 space-y-4" onSubmit={placeOrder} noValidate>
            <div>
              <label htmlFor="order-name" className="text-sm">
                Name
              </label>
              <Input
                id="order-name"
                value={name}
                autoComplete="name"
                className="mt-1.5 h-11"
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => setName(event.target.value)}
              />
              {errors.name ? (
                <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="order-email" className="text-sm">
                Email
              </label>
              <Input
                id="order-email"
                type="email"
                value={email}
                autoComplete="email"
                className="mt-1.5 h-11"
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email ? (
                <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>
              ) : null}
            </div>
            <CartTotals summary={summary} />
            <Button type="submit" className="h-11 w-full">
              Place concept order
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
