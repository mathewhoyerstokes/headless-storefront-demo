import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop-browser";
import { ShopSkeleton } from "@/components/shop-skeleton";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Filter Kante by category and sort by price or rating. The catalog is a headless JSON seam.",
};

export default function ShopPage() {
  const products = getProducts();

  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopBrowser products={products} />
    </Suspense>
  );
}
