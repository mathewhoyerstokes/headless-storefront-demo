import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { CartSheet } from "@/components/cart-sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Kante — concept store",
    template: "%s · Kante",
  },
  description:
    "A headless concept store for lighting, seating, and objects. Filter the edit, sort by price or rating, and keep a bag in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-background focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <CartProvider>
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CartSheet />
        </CartProvider>
      </body>
    </html>
  );
}
