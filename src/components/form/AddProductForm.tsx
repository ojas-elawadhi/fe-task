import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddProduct, useUpdateProduct } from "@/hooks/useProductMutations";
import { useEffect } from "react";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.coerce.number().min(0, "Stock must be 0 or more"),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({
  product,
  onClose,
}: {
  product?: {
    id: number;
    title: string;
    description?: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
  };
  onClose: () => void;
}) {
  const isEditMode = !!product;

  const { mutate: addProduct, isPending: isAdding } = useAddProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 1,
      category: product?.category ?? "",
      brand: product?.brand ?? "",
      stock: product?.stock ?? 0,
    },
  });

  useEffect(() => {
    reset({
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 1,
      category: product?.category ?? "",
      brand: product?.brand ?? "",
      stock: product?.stock ?? 0,
    });
  }, [product, reset]);

  const onSubmit = (values: ProductFormData) => {
    if (isEditMode && product?.id) {
      updateProduct(
        { id: product.id, ...values },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
          onError: () => {
            console.error("Failed to update product.");
          },
        },
      );
    } else {
      addProduct(values, {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: () => {
          console.error("Failed to add product.");
        },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-md bg-white p-6 shadow-md dark:bg-[#191919] dark:text-white"
    >
      <h2 className="text-xl font-semibold">
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1 block font-medium">
            Title
          </label>
          <input
            {...register("title")}
            id="title"
            className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="brand" className="mb-1 block font-medium">
            Brand
          </label>
          <input
            {...register("brand")}
            id="brand"
            className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.brand.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block font-medium">
            Category
          </label>
          <input
            {...register("category")}
            id="category"
            className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block font-medium">
            Price ($)
          </label>
          <input
            type="number"
            step={"any"}
            {...register("price")}
            id="price"
            className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="mb-1 block font-medium">
            Stock
          </label>
          <input
            type="number"
            {...register("stock")}
            id="stock"
            className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.stock.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block font-medium">
          Description
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={4}
          className="w-full rounded border border-gray-300 px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isAdding || isUpdating}
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isEditMode
            ? isUpdating
              ? "Updating..."
              : "Update Product"
            : isAdding
              ? "Saving..."
              : "Save Product"}
        </button>
      </div>
    </form>
  );
}
