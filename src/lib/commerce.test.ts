import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addLine,
  parseLines,
  removeLine,
  setLineQuantity,
  summarize,
} from "./cart-math.ts";
import { queryProducts, type Product } from "./catalog-query.ts";

const catalog: Product[] = [
  {
    id: "lamp",
    productNumber: "KN-1",
    name: "Lamp",
    category: "Lighting",
    price: 100,
    rating: 4.2,
    reviewCount: 4,
    image: "/lamp.jpg",
    imageAlt: "Lamp",
    description: "A brass lamp",
    material: "Brass",
    dimensions: "H 10",
    stock: 3,
    featured: false,
  },
  {
    id: "chair",
    productNumber: "KN-2",
    name: "Chair",
    category: "Seating",
    price: 400,
    rating: 4.9,
    reviewCount: 10,
    image: "/chair.jpg",
    imageAlt: "Chair",
    description: "Oak chair",
    material: "Oak",
    dimensions: "H 80",
    stock: 2,
    featured: true,
  },
  {
    id: "bowl",
    productNumber: "KN-3",
    name: "Bowl",
    category: "Ceramics",
    price: 40,
    rating: 4.5,
    reviewCount: 8,
    image: "/bowl.jpg",
    imageAlt: "Bowl",
    description: "Stoneware bowl",
    material: "Stoneware",
    dimensions: "Ø 12",
    stock: 6,
    featured: false,
  },
];

describe("queryProducts", () => {
  it("filters by category slug and sorts by price", () => {
    const result = queryProducts(catalog, {
      category: "lighting",
      sort: "price-asc",
    });
    assert.deepEqual(
      result.map((product) => product.id),
      ["lamp"],
    );
  });

  it("sorts by rating, then review count", () => {
    const result = queryProducts(catalog, { sort: "rating" });
    assert.deepEqual(
      result.map((product) => product.id),
      ["chair", "bowl", "lamp"],
    );
  });

  it("matches search text across name and material", () => {
    const result = queryProducts(catalog, { q: "stoneware" });
    assert.equal(result.length, 1);
    assert.equal(result[0]?.id, "bowl");
  });

  it("puts featured products first", () => {
    const result = queryProducts(catalog, { sort: "featured" });
    assert.equal(result[0]?.id, "chair");
  });
});

describe("cart math", () => {
  it("ignores malformed storage", () => {
    assert.deepEqual(parseLines("not-json"), []);
    assert.deepEqual(parseLines(JSON.stringify([{ productId: "lamp" }])), []);
    assert.deepEqual(parseLines(JSON.stringify([{ productId: "lamp", quantity: 2 }])), [
      { productId: "lamp", quantity: 2 },
    ]);
  });

  it("adds quantities without passing stock", () => {
    const once = addLine([], "lamp", 2, 3);
    const twice = addLine(once, "lamp", 2, 3);
    assert.deepEqual(twice, [{ productId: "lamp", quantity: 3 }]);
  });

  it("removes a line when quantity drops below 1", () => {
    const lines = [{ productId: "lamp", quantity: 1 }];
    assert.deepEqual(setLineQuantity(lines, "lamp", 0, 3), []);
    assert.deepEqual(removeLine(lines, "lamp"), []);
  });

  it("charges delivery under the threshold and includes VAT in the total", () => {
    const summary = summarize([{ price: 100, quantity: 2 }]);
    assert.equal(summary.subtotal, 200);
    assert.equal(summary.shipping, 12);
    assert.equal(summary.total, 212);
    assert.equal(summary.remainingForFreeShipping, 50);
    assert.equal(summary.vat, 33.85);
    assert.equal(summary.itemCount, 2);
  });

  it("drops delivery once the bag reaches the threshold", () => {
    const summary = summarize([{ price: 250, quantity: 1 }]);
    assert.equal(summary.shipping, 0);
    assert.equal(summary.total, 250);
    assert.equal(summary.remainingForFreeShipping, 0);
  });
});
