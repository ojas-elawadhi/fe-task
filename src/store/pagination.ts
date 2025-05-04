import { create } from "zustand";

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  has_next: boolean;
  total_count: number;
}

interface PaginationStore {
  pagination: PaginationProps;
  setPagination: (pagination: Partial<PaginationProps>) => void;
  setPage: (pageIndex: number) => void;
  setPerPage: (pageSize: number) => void;
  resetPagination: () => void;
}

export const usePaginationStore = create<PaginationStore>((set) => ({
  pagination: {
    pageIndex: 0,
    pageSize: 10,
    has_next: false,
    total_count: 0,
  },
  setPagination: (pagination) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        ...pagination,
      },
    })),
  setPage: (pageIndex) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        pageIndex,
      },
    })),
  setPerPage: (pageSize) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        pageSize,
        pageIndex: 0, // reset to first page
      },
    })),
  resetPagination: () =>
    set({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
        has_next: false,
        total_count: 0,
      },
    }),
}));
