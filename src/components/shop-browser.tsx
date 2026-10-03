"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORIES,
  categoryFromParam,
  categorySlug,
  isSortKey,
  queryProducts,
  SORTS,
  type Product,
  type SortKey,
} from "@/lib/catalog-query";

export function ShopBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");
  const query = searchParams.get("q") ?? "";
  const category = categoryFromParam(categoryParam);
  const sort: SortKey = isSortKey(sortParam) ? sortParam : "featured";
  const visible = queryProducts(products, {
    category: categoryParam,
    sort,
    q: query,
  });

  function update(next: { category?: string | null; sort?: string | null; q?: string | null }) {
    const params = new URLSearchParams(searchParams.toString());
    const apply = (key: string, value: string | null | undefined, hidden: string[]) => {
      if (value === undefined) return;
      if (value === null || value.trim() === "" || hidden.includes(value)) {
        params.delete(key);
        return;
      }
      params.set(key, value);
    };
    apply("category", next.category, ["all"]);
    apply("sort", next.sort, ["featured"]);
    apply("q", next.q, []);
    const qs = params.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  }

  const filtersActive = Boolean(category || query || sort !== "featured");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            The edit
          </p>
          <h1 className="font-display mt-2 text-4xl sm:text-5xl">
            {category ?? "All objects"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">
          {visible.length} {visible.length === 1 ? "object" : "objects"}
        </p>
      </div>

      <div className="sticky top-16 z-20 -mx-4 mt-8 border-y border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="toolbar"
            aria-label="Filter by category"
          >
            <FilterChip
              pressed={!category}
              onClick={() => update({ category: null })}
            >
              All
              <span className="opacity-70 tabular-nums">{products.length}</span>
            </FilterChip>
            {CATEGORIES.map((name) => {
              const count = products.filter((product) => product.category === name).length;
              return (
                <FilterChip
                  key={name}
                  pressed={category === name}
                  onClick={() => update({ category: categorySlug(name) })}
                >
                  {name}
                  <span className="opacity-70 tabular-nums">{count}</span>
                </FilterChip>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="catalog-search">
              Search objects
            </label>
            <Input
              id="catalog-search"
              value={query}
              placeholder="Search objects"
              className="h-10 sm:w-52"
              onChange={(event) => update({ q: event.target.value })}
            />
            <label className="sr-only" htmlFor="catalog-sort">
              Sort objects
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(event) => update({ sort: event.target.value })}
              className="h-10 border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-16 max-w-md">
          <h2 className="font-display text-3xl">Nothing matches.</h2>
          <p className="mt-3 text-muted-foreground">
            Try another category, or clear the search. The edit is small on purpose.
          </p>
          {filtersActive ? (
            <Button
              type="button"
              className="mt-6 h-11 px-5"
              onClick={() => update({ category: null, sort: null, q: null })}
            >
              Clear filters
            </Button>
          ) : null}
        </div>
      ) : (
        <div
          key={`${category ?? "all"}-${sort}`}
          className="mt-8 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center gap-2 border px-3 text-sm transition-colors ${
        pressed
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card hover:border-foreground"
      }`}
    >
      {children}
    </button>
  );
}
