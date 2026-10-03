export const CATEGORIES = [
  "Lighting",
  "Seating",
  "Tables",
  "Textiles",
  "Ceramics",
  "Storage",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string;
  productNumber: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  description: string;
  material: string;
  dimensions: string;
  stock: number;
  featured: boolean;
};

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Rating" },
] as const;

export type SortKey = (typeof SORTS)[number]["value"];

export type CatalogQuery = {
  category?: string | null;
  sort?: string | null;
  q?: string | null;
};

export function isSortKey(value: string | null | undefined): value is SortKey {
  return SORTS.some((sort) => sort.value === value);
}

export function categoryFromParam(
  value: string | null | undefined,
): Category | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return CATEGORIES.find((category) => category.toLowerCase() === normalized) ?? null;
}

export function categorySlug(category: Category) {
  return category.toLowerCase();
}

export function queryProducts(products: Product[], query: CatalogQuery): Product[] {
  const category = categoryFromParam(query.category);
  const sort: SortKey = isSortKey(query.sort) ? query.sort : "featured";
  const terms = query.q?.trim().toLowerCase() ?? "";

  const filtered = products.filter((product) => {
    if (category && product.category !== category) return false;
    if (!terms) return true;
    const haystack = [
      product.name,
      product.category,
      product.material,
      product.description,
      product.productNumber,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(terms);
  });

  return filtered.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price || a.name.localeCompare(b.name);
      case "price-desc":
        return b.price - a.price || a.name.localeCompare(b.name);
      case "rating":
        return (
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount ||
          a.name.localeCompare(b.name)
        );
      default:
        return (
          Number(b.featured) - Number(a.featured) ||
          b.rating - a.rating ||
          a.name.localeCompare(b.name)
        );
    }
  });
}

export function relatedProducts(
  products: Product[],
  current: Product,
  limit = 3,
): Product[] {
  const sameCategory = products.filter(
    (product) => product.category === current.category && product.id !== current.id,
  );
  const others = products.filter(
    (product) => product.category !== current.category && product.featured,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
