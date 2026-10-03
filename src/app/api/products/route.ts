import { searchCatalog } from "@/lib/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const products = searchCatalog({
    category: searchParams.get("category"),
    sort: searchParams.get("sort"),
    q: searchParams.get("q"),
  });

  return Response.json({
    count: products.length,
    products,
  });
}
