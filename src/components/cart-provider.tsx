"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getProduct } from "@/lib/catalog";
import {
  addLine,
  parseLines,
  removeLine,
  setLineQuantity,
  summarize,
  type CartLine,
  type CartSummary,
} from "@/lib/cart-math";
import type { Product } from "@/lib/catalog-query";

const STORAGE_KEY = "kante.cart.v1";
const CHANGE_EVENT = "kante-cart-change";

export type CartItem = CartLine & {
  product: Product;
};

type CartContextValue = {
  items: CartItem[];
  summary: CartSummary;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  addItem: (
    productId: string,
    quantity?: number,
    options?: { openSheet?: boolean },
  ) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  quantityOf: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function writeRaw(value: string) {
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function resolveItems(raw: string): CartItem[] {
  return parseLines(raw).flatMap((line) => {
    const product = getProduct(line.productId);
    if (!product || product.stock < 1) return [];
    return [
      {
        productId: product.id,
        quantity: Math.min(line.quantity, product.stock),
        product,
      },
    ];
  });
}

function storedLines(): CartLine[] {
  return resolveItems(readRaw()).map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const [sheetOpen, setSheetOpen] = useState(false);
  const items = useMemo(() => resolveItems(raw), [raw]);
  const summary = useMemo(
    () =>
      summarize(
        items.map((item) => ({
          price: item.product.price,
          quantity: item.quantity,
        })),
      ),
    [items],
  );

  const addItem = useCallback(
    (productId: string, quantity = 1, options?: { openSheet?: boolean }) => {
      const product = getProduct(productId);
      if (!product) return;
      writeRaw(
        JSON.stringify(addLine(storedLines(), productId, quantity, product.stock)),
      );
      if (options?.openSheet) setSheetOpen(true);
    },
    [],
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const product = getProduct(productId);
    if (!product) return;
    writeRaw(
      JSON.stringify(
        setLineQuantity(storedLines(), productId, quantity, product.stock),
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    writeRaw(JSON.stringify(removeLine(storedLines(), productId)));
  }, []);

  const clear = useCallback(() => {
    writeRaw("[]");
  }, []);

  const quantityOf = useCallback(
    (productId: string) =>
      items.find((item) => item.productId === productId)?.quantity ?? 0,
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      summary,
      sheetOpen,
      setSheetOpen,
      addItem,
      setQuantity,
      removeItem,
      clear,
      quantityOf,
    }),
    [
      items,
      summary,
      sheetOpen,
      addItem,
      setQuantity,
      removeItem,
      clear,
      quantityOf,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
