export default function ProductLoading() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="aspect-[4/5] animate-pulse bg-muted" />
      <div className="space-y-4 pt-4">
        <div className="h-4 w-24 animate-pulse bg-muted" />
        <div className="h-12 w-2/3 animate-pulse bg-muted" />
        <div className="h-4 w-full animate-pulse bg-muted" />
        <div className="h-4 w-5/6 animate-pulse bg-muted" />
      </div>
    </div>
  );
}
