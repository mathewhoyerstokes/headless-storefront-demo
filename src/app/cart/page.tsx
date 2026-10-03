import type { Metadata } from "next";
import { CartView } from "@/app/cart/cart-view";

export const metadata: Metadata = {
  title: "Bag",
  description: "Review quantities, delivery, and the VAT-inclusive total.",
};

export default function CartPage() {
  return <CartView />;
}
