# Kante

A headless concept store for lighting, seating, and objects. The storefront is a Next.js app. The catalog is a JSON file behind a small adapter, the same shape you would fill from a Shopware 6 Store API. There is no PHP backend and no real payment.

Filter the edit by category, sort by price or rating, and keep a bag in the browser. Quantities, delivery, and the VAT-inclusive total update as the bag changes.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
npm run lint
```

## What to click

- **Shop** filters by category, searches the copy, and sorts by featured, price, or rating. The choices stay in the URL.
- Product pages set a quantity and add to the bag.
- The bag remembers itself in `localStorage`, updates line quantities, and recalculates subtotal, delivery, included VAT, and total.
- Delivery is €12, and free from €250.
- **Place concept order** checks a name and email, then clears the bag. No payment is taken.

## Headless seam

`src/lib/catalog.ts` is the only module that knows where products come from. Pages and the route handlers both call it.

| Route | What it returns |
| --- | --- |
| `GET /api/products` | The catalog. Optional `category`, `sort` (`featured`, `price-asc`, `price-desc`, `rating`), and `q`. |
| `GET /api/products/[id]` | One product, or 404. |

```bash
curl "http://localhost:3000/api/products?category=lighting&sort=price-asc"
```

A Shopware 6 storefront would replace the body of that adapter with Store API calls (`/store-api/product`, `/store-api/category`) and map `calculatedPrice.unitPrice`, `cover`, and `ratingAverage` onto the same `Product` type. The grid, filters, and bag UI would stay put. A live cart would then post line items to `/store-api/checkout/cart` instead of `localStorage`.

## Photographs

Product and hero photographs are from Unsplash and stored in `public/catalog/` so the shop runs without a remote image host.

- [Arc lamp room](https://unsplash.com/photos/1618221195710-dd6b41faaea6)
- [Cove pendant](https://unsplash.com/photos/1513506003901-1e6a229e2d15)
- [Loft pendant](https://unsplash.com/photos/1524484485831-a92ffc0de03f)
- [Hale floor lamp](https://unsplash.com/photos/1507473885765-e6ed057f782c)
- [Dome cluster](https://unsplash.com/photos/1540932239986-30128078f3c5)
- [Arc floor lamp](https://unsplash.com/photos/1519710164239-da123dc03ef4)
- [Grove sofa](https://unsplash.com/photos/1555041469-a586c61ea9bc)
- [Button lounge](https://unsplash.com/photos/1567538096630-e0c55bd6374c)
- [Ridge chair](https://unsplash.com/photos/1598300042247-d088f8ab3a91)
- [Slot stool](https://unsplash.com/photos/1503602642458-232111445657)
- [Cafe table](https://unsplash.com/photos/1533090481720-856c6e3c1fdc)
- [Drawer console](https://unsplash.com/photos/1530018607912-eff2daa1bac4)
- [Tripod side table](https://unsplash.com/photos/1499933374294-4584851497cc)
- [Archive rug](https://unsplash.com/photos/1600166898405-da9535204843)
- [Field throw](https://unsplash.com/photos/1578500494198-246f612d3b3d)
- [Day cushion](https://unsplash.com/photos/1584100936595-c0654b55a2e2)
- [Tide plates](https://unsplash.com/photos/1578749556568-bc2c40e68b61)
- [Kiln cups](https://unsplash.com/photos/1610701596007-11502861dcfa)
- [Speck vases](https://unsplash.com/photos/1565193566173-7a0ee3dbe261)
- [Offset shelf](https://unsplash.com/photos/1594026112284-02bb6f3352fe)
