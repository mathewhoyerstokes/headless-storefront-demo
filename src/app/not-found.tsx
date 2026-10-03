import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        404
      </p>
      <h1 className="font-display mt-3 text-4xl sm:text-5xl">That object is not in the edit.</h1>
      <p className="mt-4 text-muted-foreground">
        The link may be old, or the piece was never on the floor.
      </p>
      <Link href="/shop" className={cn(buttonVariants({ className: "mt-8 h-11 px-5" }))}>
        Back to the shop
      </Link>
    </div>
  );
}
