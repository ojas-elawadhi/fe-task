// src/app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";

// Dynamic title function using generateMetadata
export async function generateMetadata({ params }: { params: { id: string } }) {
   const { id } = await params;

    // Fetch product by ID using the parameter directly (no need to await params)
  const res = await fetch(`https://dummyjson.com/products/${id}`);

  // Check if the response is OK, if not return the notFound page
  if (!res.ok) return { title: "Product not found – MyShop" };

  // Parse the product data from the response
  const product = await res.json();

  // Return dynamic title for this product page
  return {
    title: `${product.title} – MyShop`, // Set title dynamically
  };
}

// Fetch product info using async/await correctly
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Ensure params are awaited
  const { id } = await params;

  // Fetch product by ID
  const res = await fetch(`https://dummyjson.com/products/${id}`);

  // Check if the response is OK, if not return the notFound page
  if (!res.ok) return notFound();

  // Parse the product data from the response
  const product = await res.json();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">{product.title}</h1>

      <div className="flex flex-col gap-6 sm:flex-row">
        <Image
          src={product.thumbnail}
          alt={product.title}
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
