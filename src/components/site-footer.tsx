import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-2xl tracking-[0.16em]">KANTE</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Kante is German for edge. A concept store for lighting, seating, and
            objects — prices include 19% VAT, and the bag stays in this browser.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm md:items-end">
          <Link href="/shop" className="hover:text-clay">
            Shop the edit
          </Link>
          <Link href="/cart" className="hover:text-clay">
            Your bag
          </Link>
          <p className="mt-4 max-w-xs text-muted-foreground md:text-right">
            Free delivery from €250. This checkout does not take payment.
          </p>
        </div>
      </div>
    </footer>
  );
}
