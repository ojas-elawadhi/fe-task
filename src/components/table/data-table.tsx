"use client";

import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { CircleAlert, Delete, Loader, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePaginationStore } from "@/store/pagination";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  error: Error | null;
  isLoading: boolean;
  refetch: () => void;
  heading?: string;
  children?: React.ReactNode;
  addHref?: string;
  addButton?: React.ElementType; // Updated to allow any React component
  deleteButton?: React.ElementType; // Updated to allow any React component
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  selectable?: boolean;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  error,
  isLoading,
  refetch,
  heading,
  children,
  addHref,
  addButton: AddButton, // Use a capitalized name to indicate it's a component
  deleteButton: DeleteButton, // Use a capitalized name to indicate it's a component
  columnVisibility,
  setColumnVisibility,
  selectable = true,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
}: DataTableProps<TData, TValue>) {
  const { pagination } = usePaginationStore();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    {},
  );
  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(pagination.total_count / pagination.pageSize),
    manualPagination: true,
    manualSorting: true, // ✅ Enable server-side sorting
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnPinning,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnPinningChange: setColumnPinning,
    autoResetAll: false,
  });

  const router = useRouter();

  const getCommonPinningStyles = (
    column: Column<TData, unknown>,
  ): React.CSSProperties => {
    return {
      position: column.getIsPinned()
        ? ("sticky" as React.CSSProperties["position"])
        : undefined,
      left:
        column.getIsPinned() === "left"
          ? `${column.getStart("left")}px`
          : undefined,
      right:
        column.getIsPinned() === "right"
          ? `${column.getAfter("right")}px`
          : undefined,
      zIndex: column.getIsPinned() ? 1 : undefined,
      backgroundColor: column.getIsPinned() ? "#F9FAFB" : undefined,
    };
  };

  return (
    <div
      className="rounded-[20px]"
      style={{
        boxShadow: "0px 5px 22px 0px #0000000D, 0px 0px 0px 2px #0000000F",
      }}
    >
      {/* <div className="flex items-center justify-between border-b border-[#DCDFE4] px-5 py-4">
        <p className="text-2xl font-medium tracking-wide">{heading}</p>
        <div>
          <div className="flex flex-row items-center gap-2 text-sm text-[#667085]">
            {selectable && (
              <>
                <div className="flex flex-row gap-1">
                  {table.getSelectedRowModel().rows.length} <p>selected</p>
                </div>
                {table.getSelectedRowModel().rows.length > 0 && (
                  <>
                    <p>|</p>
                    <Button
                      variant="link"
                      className="px-0"
                      onClick={() => {
                        setRowSelection({});
                      }}
                    >
                      Deselect
                    </Button>
                  </>
                )}
              </>
            )}

            {DeleteButton && table.getSelectedRowModel().rows.length > 0 && (
              <DeleteButton
                rows={table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original)}
                clearSelection={() => setRowSelection({})}
              >
                <Button variant="destructive" className="flex gap-2">
                  <Delete />
                  <p>Delete</p>
                </Button>
              </DeleteButton>
            )}
            {(addHref ?? AddButton) && (
              <div className="h-[30px] w-[1px] bg-[#DCDFE4]" />
            )}
            {AddButton && (
              <AddButton>
                <Button className="flex gap-2">
                  <Plus />
                  <p>Add</p>
                </Button>
              </AddButton>
            )}
            {addHref && (
              <Link href={addHref || ""}>
                <Button className="flex gap-2">
                  <Plus />
                  <p>Add</p>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div> */}
      {/* <div className="h-full px-5 py-4">
        <DataTableToolbar
          table={table}
          filter={children}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </div> */}
      <div className="relative max-h-[63vh] w-full overflow-auto border-b">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnRelativeDepth =
                    header.depth - header.column.depth;
                  if (columnRelativeDepth > 1) {
                    return null;
                  }

                  let rowSpan = 1;
                  if (header.isPlaceholder) {
                    const leafs = header.getLeafHeaders();
                    rowSpan =
                      (leafs?.[leafs.length - 1]?.depth ?? 0) - header.depth;
                  }

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      rowSpan={rowSpan}
                      style={{
                        ...getCommonPinningStyles(header.column),
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                      className={
                        header.column.columnDef.header ? "px-4 py-6" : "p-0"
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => router.push(`/products/${Number(row.id) + 1}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={getCommonPinningStyles(cell.column)}
                      className={
                        cell.column.columnDef.cell ? "border px-4 py-6" : "p-0"
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader className="text-primary-purple mr-2 animate-spin" />
                      <span>Loading</span>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center p-4">
                      <CircleAlert className="mb-2 text-3xl text-red-500" />
                      <p>Error: {error.message}</p>
                      <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    "No data found"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && !error && <DataTablePagination table={table} />}
    </div>
  );
}
