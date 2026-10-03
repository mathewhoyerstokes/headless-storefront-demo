export const FREE_SHIPPING_THRESHOLD = 250;
export const SHIPPING_FEE = 12;
export const VAT_RATE = 0.19;

export type CartLine = {
  productId: string;
  quantity: number;
};

export type PricedLine = {
  price: number;
  quantity: number;
};

export type CartSummary = {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  vat: number;
  remainingForFreeShipping: number;
};

function cents(value: number) {
  return Math.round(value * 100) / 100;
}

export function parseLines(raw: string): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const lines: CartLine[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const productId = (item as { productId?: unknown }).productId;
      const quantity = (item as { quantity?: unknown }).quantity;
      if (typeof productId !== "string" || productId.length === 0) continue;
      if (typeof quantity !== "number" || !Number.isInteger(quantity)) continue;
      if (quantity < 1 || quantity > 99) continue;
      lines.push({ productId, quantity });
    }
    return lines;
  } catch {
    return [];
  }
}

export function addLine(
  lines: CartLine[],
  productId: string,
  quantity: number,
  stock: number,
): CartLine[] {
  if (stock < 1) return lines;
  const add = Math.max(1, quantity);
  const existing = lines.find((line) => line.productId === productId);
  if (!existing) {
    return [...lines, { productId, quantity: Math.min(add, stock) }];
  }
  return lines.map((line) =>
    line.productId === productId
      ? { ...line, quantity: Math.min(stock, line.quantity + add) }
      : line,
  );
}

export function setLineQuantity(
  lines: CartLine[],
  productId: string,
  quantity: number,
  stock: number,
): CartLine[] {
  if (quantity < 1) {
    return lines.filter((line) => line.productId !== productId);
  }
  return lines.map((line) =>
    line.productId === productId
      ? { ...line, quantity: Math.min(stock, quantity) }
      : line,
  );
}

export function removeLine(lines: CartLine[], productId: string) {
  return lines.filter((line) => line.productId !== productId);
}

export function summarize(lines: PricedLine[]): CartSummary {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cents(
    lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
  );
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = cents(subtotal + shipping);
  const vat = cents(total - total / (1 + VAT_RATE));
  const remainingForFreeShipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : cents(FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    itemCount,
    subtotal,
    shipping,
    total,
    vat,
    remainingForFreeShipping,
  };
}
