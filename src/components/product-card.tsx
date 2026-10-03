"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import { useCart } from "@/components/cart-provider";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/catalog-query";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem, quantityOf } = useCart();
  const [added, setAdded] = useState(false);
  const inBag = quantityOf(product.id);
  const atStock = inBag >= product.stock;

  function handleAdd() {
    if (atStock) return;
    addItem(product.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article
      className="card-in group flex flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.stock <= 4 ? (
          <span className="absolute top-3 left-3 bg-background/90 px-2 py-1 text-[11px] tracking-wide uppercase">
            {product.stock} left
          </span>
        ) : null}
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            {product.category}
          </p>
          <h2 className="font-display mt-1 text-xl leading-tight">
            <Link href={`/product/${product.id}`} className="hover:text-clay">
              {product.name}
            </Link>
          </h2>
          <div className="mt-2">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
        </div>
        <p className="shrink-0 pt-5 text-sm tabular-nums">{formatMoney(product.price)}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="mt-4 h-10 w-full"
        onClick={handleAdd}
        disabled={atStock}
      >
        {atStock ? "All in your bag" : added ? "Added" : inBag > 0 ? `Add another (${inBag})` : "Add to bag"}
      </Button>
    </article>
  );
}
