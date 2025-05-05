import { useQuery } from "@tanstack/react-query";

// Define the shape of a product
type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
  stock: number;
  // Add more fields if needed
};

// Define the shape of the API response
type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export const useProducts = (
  limit = 10,
  skip = 0,
  sortBy?: string,
  order?: "asc" | "desc",
) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", limit, skip, sortBy, order],
    queryFn: async () => {
      const url = new URL("https://dummyjson.com/products");
      url.searchParams.set("limit", limit.toString());
      url.searchParams.set("skip", skip.toString());
      if (sortBy) url.searchParams.set("sortBy", sortBy);
      if (order) url.searchParams.set("order", order);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json() as Promise<ProductsResponse>;
    },
    staleTime: 5 * 60 * 1000,
  });
};
