import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/components/ui/button";
import { getCategoryCards, getFeatured, getProduct } from "@/lib/catalog";
import { categorySlug } from "@/lib/catalog-query";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const featured = getFeatured();
  const categories = getCategoryCards();
  const arc = getProduct("arc-floor-lamp");

  return (
    <>
      <section className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        <div className="flex flex-col justify-end px-4 py-12 sm:px-8 lg:px-12 lg:py-16">
          <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Autumn edit
          </p>
          <h1 className="font-display mt-4 max-w-xl text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            Rooms with a cleaner edge.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Lighting, seating, and objects chosen for how they sit in a room.
            Filter the edit, sort by price or rating, and keep a bag that
            remembers what you added.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className={cn(buttonVariants({ className: "h-11 px-5" }))}>
              Shop the edit
            </Link>
            <Link
              href="/shop?category=lighting"
              className={cn(
                buttonVariants({ variant: "outline", className: "h-11 px-5" }),
              )}
            >
              Lighting
            </Link>
          </div>
        </div>
        <div className="relative min-h-[420px] bg-muted">
          <Image
            src="/catalog/hero.jpg"
            alt="Living room with a grey sofa, wood coffee table, and an arc floor lamp"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          {arc ? (
            <Link
              href={`/product/${arc.id}`}
              className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4 bg-background/92 px-4 py-3 backdrop-blur-sm sm:left-auto sm:w-80"
            >
              <span>
                <span className="block text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  In this room
                </span>
                <span className="font-display mt-1 block text-xl">{arc.name}</span>
              </span>
              <span className="text-sm tabular-nums">{formatMoney(arc.price)}</span>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl">Shop by room, or by type.</h2>
          <Link href="/shop" className="hidden text-sm hover:text-clay sm:inline">
            All objects
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.category}
              href={`/shop?category=${categorySlug(category.category)}`}
              className="group relative aspect-[4/5] overflow-hidden bg-muted sm:aspect-[5/4]"
            >
              <Image
                src={category.image}
                alt={category.imageAlt}
                fill
                sizes="(min-width: 768px) 30vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pt-16 pb-3 text-white">
                <span className="font-display text-2xl">{category.category}</span>
                <span className="text-sm tabular-nums">{category.count}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <h2 className="font-display text-3xl sm:text-4xl">From the edit</h2>
        <div className="mt-8 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
