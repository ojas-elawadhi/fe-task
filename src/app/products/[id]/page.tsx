import { notFound } from "next/navigation";
import Image from "next/image";
import { type Metadata } from "next";
import type { Product } from "@/components/table/ProductTable";

// Define a type that matches the expected SegmentParams
type ProductParams = {
  id: string;
};

// Match the PageProps interface from your Next.js config
interface PageProps {
  params: Promise<ProductParams>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

// Implement generateMetadata with the correct param structure
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Await the params since they're a Promise according to PageProps
  const { id } = await params;

  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) return { title: "Product not found – MyShop" };

  const product = (await res.json()) as Product;
  return {
    title: `${product.title} – MyShop`,
  };
}

// Implement the page component with the correct param structure
export default async function ProductPage({ params }: PageProps) {
  // Await the params since they're a Promise according to PageProps
  const { id } = await params;

  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) return notFound();

  const product = await res.json() as Product;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">{product.title}</h1>

      <div className="flex flex-col gap-6 sm:flex-row">
        <Image
          src={product.thumbnail ?? "/placeholder-image.jpg"}
          alt={product.title ?? "Product image"}
          width={300}
          height={300}
          className="rounded shadow"
        />
        <div className="space-y-2">
          <p className="text-xl font-semibold text-green-700">
            ${product.price}
          </p>
          <p>
            <span className="font-medium">Brand:</span> {product.brand}
          </p>
          <p>
            <span className="font-medium">Category:</span> {product.category}
          </p>
          <p>
            <span className="font-medium">Stock:</span> {product.stock}
          </p>
          <p className="mt-4 text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
