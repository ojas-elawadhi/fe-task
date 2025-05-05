// App.tsx or page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { type SortingState } from "@tanstack/react-table";

import { useProducts } from "@/hooks/useProducts";
import React from "react";
import { DataTable } from "@/components/table/data-table";

import { useDeleteProduct } from "../../hooks/useProductMutations";
import Image from "next/image";
import { ProductForm } from "../form/AddProductForm";
import { usePaginationStore } from "@/store/pagination";
import { type ColumnDef } from "@tanstack/react-table";
export type Product = {
  id?: number;
  title?: string;
  category?: string;
  price?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  thumbnail?: string;
  description: string; // Added description property
};
export default function ProductTable() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { pagination, setPagination } = usePaginationStore();
  const limit = pagination.pageSize;
  const skip = pagination.pageIndex * pagination.pageSize;

  const [sorting, setSorting] = useState<SortingState>([]);

  const sortBy = sorting[0]?.id;
  const order = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading, error, refetch } = useProducts(
    limit,
    skip,
    sortBy,
    sortBy ? order : undefined,
  );

  useEffect(() => {
    if (data?.total) {
      setPagination({
        total_count: data.total,
        has_next: skip + limit < data.total,
      });
    }
  }, [data?.total, limit, skip]);

  const { mutate: deleteProduct } = useDeleteProduct();

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "thumbnail",
      header: "",
      cell: ({ row }) => (
        <Image
          src={row.original.thumbnail ?? "/placeholder.png"}
          alt={row.original.title ?? "Product Image"}
          width={64}
          height={64}
          className="h-16 w-16 rounded object-cover"
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      enableSorting: true,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const formattedCategory = row.original.category
          ?.split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return <span>{formattedCategory}</span>;
      },
    },
    {
      accessorKey: "brand",
      header: "Brand",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      enableSorting: true,
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              setEditingProduct(row.original);
              setShowForm(true);
              e.stopPropagation();
            }}
            className="cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              if (row.original.id !== undefined) {
                deleteProduct(row.original.id);
              } else {
                console.error("Product ID is undefined");
              }
              e.stopPropagation();
            }}
            className="cursor-pointer text-red-500"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  const products = useMemo(() => data?.products ?? [], [data]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Product Table</h2>
        <button
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          Add Product
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        error={error}
        isLoading={isLoading}
        refetch={refetch}
        sorting={sorting}
        setSorting={setSorting}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded bg-[#d2d2d2] p-4 shadow dark:bg-[#191919]">
            <ProductForm
              product={
                editingProduct
                  ? {
                      ...editingProduct,
                      id: editingProduct.id ?? 0, // Ensure id is a number
                      title: editingProduct.title ?? "", // Ensure title is a string
                      price: editingProduct.price ?? 0, // Ensure price is a number
                      category: editingProduct.category ?? "", // Ensure category is a string
                      brand: editingProduct.brand ?? "", // Ensure brand is a string
                      stock: editingProduct.stock ?? 0, // Ensure stock is a number
                    }
                  : undefined
              }
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
