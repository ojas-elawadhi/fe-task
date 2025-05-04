import React from "react";
import { Package } from "lucide-react"; // you can swap this with any icon
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between border-b p-4">
      {/* Logo + text on the left */}
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="text-xl font-bold">Dummy App</span>
      </div>

      {/* Theme toggle on the right */}
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </div>
  );
}
