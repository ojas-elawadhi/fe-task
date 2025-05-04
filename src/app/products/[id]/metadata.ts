// src/app/products/[id]/metadata.ts
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  if (!res.ok) return notFound();

  const product = await res.json();

  return {
    title: product.title,
    description: product.description,
  };
}
