"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { QuantityStepper } from "@/components/quantity-stepper";
import { StarRating } from "@/components/star-rating";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { categorySlug, type Product } from "@/lib/catalog-query";
import { formatMoney } from "@/lib/format";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addItem, quantityOf } = useCart();
  const [quantity, setQuantity] = useState(1);
  const inBag = quantityOf(product.id);
  const remaining = product.stock - inBag;
  const atStock = remaining < 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/shop?category=${categorySlug(product.category)}`}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted lg:sticky lg:top-24">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {product.productNumber}
          </p>
          <h1 className="font-display mt-2 text-4xl leading-[1.05] sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="text-lg tabular-nums">{formatMoney(product.price)}</p>
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm">
            <div>
              <dt className="text-muted-foreground">Material</dt>
              <dd className="mt-1">{product.material}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Dimensions</dt>
              <dd className="mt-1">{product.dimensions}</dd>
            </div>
          </dl>

          <p className="mt-5 text-sm">
            {product.stock <= 4
              ? `${product.stock} left in the edit.`
              : "In stock, ships from the concept warehouse."}
            {inBag > 0 ? ` ${inBag} already in your bag.` : ""}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <QuantityStepper
              value={quantity}
              max={Math.max(remaining, 1)}
              label={product.name}
              onChange={setQuantity}
            />
            <Button
              type="button"
              className="h-11 flex-1 px-5"
              disabled={atStock}
              onClick={() => {
                addItem(product.id, quantity, { openSheet: true });
                setQuantity(1);
              }}
            >
              {atStock ? "All in your bag" : "Add to bag"}
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Price includes 19% VAT. Free delivery from €250.
          </p>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-3xl">Also in the room</h2>
          <div className="mt-8 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
