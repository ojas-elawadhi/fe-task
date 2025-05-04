"use client";

import React from "react";
import Navbar from "@/components/navbar";
import ProductTable from "@/components/table/ProductTable";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      <div className="flex h-full w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <ProductTable />
        </div>
      </div>
    </main>
  );
}
