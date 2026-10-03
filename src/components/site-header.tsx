"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { summary, setSheetOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative grid size-7 place-items-center bg-primary"
          >
            <span className="absolute h-px w-4 -rotate-45 bg-primary-foreground" />
          </span>
          <span className="font-display text-xl tracking-[0.18em]">KANTE</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/shop"
            className="px-3 py-2 text-sm tracking-wide hover:text-clay"
          >
            Shop
          </Link>
          <Button
            type="button"
            variant="outline"
            className="h-10 px-3"
            onClick={() => setSheetOpen(true)}
          >
            Bag
            {summary.itemCount > 0 ? (
              <span className="tabular-nums">{summary.itemCount}</span>
            ) : null}
          </Button>
        </nav>
      </div>
    </header>
  );
}
