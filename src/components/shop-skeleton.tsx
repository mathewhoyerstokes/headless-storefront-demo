export function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="h-10 w-40 animate-pulse bg-muted" />
      <div className="mt-8 flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-9 w-24 animate-pulse bg-muted" />
        ))}
      </div>
      <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[4/5] animate-pulse bg-muted" />
            <div className="mt-3 h-4 w-24 animate-pulse bg-muted" />
            <div className="mt-2 h-6 w-40 animate-pulse bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
