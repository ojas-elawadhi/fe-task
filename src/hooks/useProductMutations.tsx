// hooks/useProductMutations.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "https://dummyjson.com/products";

// Add Product
export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      price: number;
      category?: string;
      brand?: string;
      stock?: number;
    }) => {
      const res = await axios.post(`${BASE_URL}/add`, data);
      return res.data;
    },
    onSuccess: (newProduct) => {
      toast.success("Product added successfully!");
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return [newProduct];
        return [...old, newProduct];
      });
    },
    onError: () => {
      toast.error("Failed to add product.");
    },
  });
}

// Update Product
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: number;
      title: string;
      description?: string;
      price: number;
      category?: string;
      brand?: string;
      stock?: number;
    }) => {
      const res = await axios.put(`${BASE_URL}/${data.id}`, {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        brand: data.brand,
        stock: data.stock,
      });
      return res.data;
    },
    onSuccess: (updatedProduct) => {
      toast.success("Product updated successfully!");
      queryClient.setQueryData(["products"], (old: any) =>
        old?.map((p: any) => (p.id === updatedProduct.id ? updatedProduct : p)),
      );
    },
    onError: () => {
      toast.error("Failed to update product.");
    },
  });
}

// Delete Product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`${BASE_URL}/${id}`);
      return { id, ...res.data };
    },
    onSuccess: (deleted) => {
      toast.success("Product deleted successfully!");
      queryClient.setQueryData(["products"], (old: any) =>
        old?.filter((p: any) => p.id !== deleted.id),
      );
    },
    onError: () => {
      toast.error("Failed to delete product.");
    },
  });
}
