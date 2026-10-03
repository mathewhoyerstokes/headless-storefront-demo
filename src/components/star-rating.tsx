export function StarRating({
  rating,
  count,
}: {
  rating: number;
  count?: number;
}) {
  const filled = Math.round(rating);
  const label = `Rated ${rating.toFixed(1)} out of 5${
    count !== undefined ? ` from ${count} reviews` : ""
  }`;

  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label={label}>
      <span aria-hidden="true" className="tracking-[0.12em]">
        <span className="text-clay">{"★".repeat(filled)}</span>
        <span className="text-border">{"★".repeat(5 - filled)}</span>
      </span>
      <span className="tabular-nums">{rating.toFixed(1)}</span>
      {count !== undefined ? <span className="tabular-nums">({count})</span> : null}
    </p>
  );
}
