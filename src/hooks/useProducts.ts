// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";

export const useProducts = (
  limit = 10,
  skip = 0,
  sortBy?: string,
  order?: "asc" | "desc",
) => {
  return useQuery({
    queryKey: ["products", limit, skip, sortBy, order],
    queryFn: async () => {
      const url = new URL("https://dummyjson.com/products");
      url.searchParams.set("limit", limit.toString());
      url.searchParams.set("skip", skip.toString());
      if (sortBy) url.searchParams.set("sortBy", sortBy);
      if (order) url.searchParams.set("order", order);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};
