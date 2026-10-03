import productsData from "@/data/products.json";
import {
  CATEGORIES,
  categoryFromParam,
  queryProducts,
  relatedProducts,
  type Category,
  type Product,
} from "@/lib/catalog-query";

/**
 * Catalog adapter. Pages and route handlers both read through here.
 * The JSON file stands in for a headless backend. Swap this module for
 * Shopware Store API calls without changing the storefront components.
 */
export const products = productsData as Product[];

const FEATURED_IDS = [
  "grove-sofa",
  "dome-cluster",
  "button-lounge",
  "drawer-console",
];

const CATEGORY_COVERS: Record<Category, string> = {
  Lighting: "cove-pendant",
  Seating: "grove-sofa",
  Tables: "cafe-table",
  Textiles: "archive-rug",
  Ceramics: "tide-plates",
  Storage: "offset-shelf",
};

export function getProducts() {
  return products;
}

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}

export function getFeatured() {
  return FEATURED_IDS.map((id) => getProduct(id)).filter(
    (product): product is Product => Boolean(product),
  );
}

export function getCategoryCards() {
  return CATEGORIES.map((category) => {
    const cover = getProduct(CATEGORY_COVERS[category]);
    const count = products.filter((product) => product.category === category).length;
    return {
      category,
      count,
      image: cover?.image ?? "",
      imageAlt: cover?.imageAlt ?? category,
    };
  });
}

export function searchCatalog(query: {
  category?: string | null;
  sort?: string | null;
  q?: string | null;
}) {
  return queryProducts(products, query);
}

export function getRelated(product: Product) {
  return relatedProducts(products, product);
}

export function categoryExists(value: string | null | undefined) {
  return categoryFromParam(value) !== null;
}
