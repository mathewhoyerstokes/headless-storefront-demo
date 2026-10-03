"use client";

import Image from "next/image";
import Link from "next/link";
import { CartTotals } from "@/components/cart-summary";
import { QuantityStepper } from "@/components/quantity-stepper";
import { useCart } from "@/components/cart-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { items, summary, sheetOpen, setSheetOpen, setQuantity, removeItem } = useCart();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent
        side="right"
        className="w-full gap-0 data-[side=right]:sm:max-w-md"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-display text-2xl">Your bag</SheetTitle>
          <SheetDescription>
            {summary.itemCount === 0
              ? "Nothing here yet."
              : `${summary.itemCount} ${summary.itemCount === 1 ? "object" : "objects"} · prices include VAT`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center px-4">
            <p className="text-muted-foreground">
              The edit is still on the floor. Add a lamp, a chair, a cup.
            </p>
            <Link
              href="/shop"
              className={cn(buttonVariants({ className: "mt-6 h-11" }), "w-full")}
              onClick={() => setSheetOpen(false)}
            >
              Browse the edit
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <Link
                    href={`/product/${item.productId}`}
                    onClick={() => setSheetOpen(false)}
                    className="relative size-20 shrink-0 overflow-hidden bg-muted"
                  >
                    <Image
                      src={item.product.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/product/${item.productId}`}
                        onClick={() => setSheetOpen(false)}
                        className="font-display text-lg leading-tight hover:text-clay"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm tabular-nums">
                        {formatMoney(item.product.price * item.quantity)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                      {formatMoney(item.product.price)} each
                    </p>
                    <div className="mt-3 flex items-center gap-3">
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
            <div className="space-y-4 border-t border-border p-4">
              <CartTotals summary={summary} />
              <Link
                href="/cart"
                className={cn(buttonVariants({ className: "h-11" }), "w-full")}
                onClick={() => setSheetOpen(false)}
              >
                Review bag
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
