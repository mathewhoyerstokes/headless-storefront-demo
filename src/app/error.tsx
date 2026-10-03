"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">Something slipped.</h1>
      <p className="mt-4 text-muted-foreground">
        The storefront could not finish loading this view. Try it again.
        {error.digest ? ` Reference ${error.digest}.` : ""}
      </p>
      <Button type="button" className="mt-8 h-11 px-5" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
