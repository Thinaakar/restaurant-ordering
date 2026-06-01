"use client";

import React from "react";
import { useTables } from "@/hooks/use-tables";
import type { TableStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<TableStatus, string> = {
  available: "text-emerald   border-emerald/25   bg-emerald/8",
  occupied: "text-red-400   border-red-400/25   bg-red-400/8",
  cleaning: "text-amber-400 border-amber-400/25 bg-amber-400/8",
};

const STATUS_DOT: Record<TableStatus, string> = {
  available: "bg-emerald",
  occupied: "bg-red-400",
  cleaning: "bg-amber-400",
};

const STATUS_LABEL: Record<TableStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  cleaning: "Cleaning",
};

export default function AdminTablesPage() {
  const { tables, updateTableStatus } = useTables();
  const displayTables = tables;

  return (
    <div className="animate-fade-in w-full h-full flex flex-col">
      {/* Page header */}
      <div className="mb-8 border-b border-border/20 pb-6">
        <h1 className="text-3xl font-display font-semibold tracking-tight uppercase">
          Table Management
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          View and update the status of all restaurant tables.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-border/40 flex-1 flex flex-col">
        {/* Header row */}
        <div className="grid grid-cols-3 bg-surface-2/60 border-b border-border/40 px-6 py-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Table Number
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Number of Seats
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Status
          </span>
        </div>

        {/* Data rows */}
        <div className="overflow-y-auto flex-1">
          {displayTables.map((table, idx) => (
            <div
              key={table.id}
              className={cn(
                "grid grid-cols-3 items-center px-6 py-4 transition-colors duration-150",
                idx !== displayTables.length - 1 && "border-b border-border/25",
                "hover:bg-surface-2/30",
              )}
            >
              {/* Table name */}
              <span className="text-sm font-semibold text-foreground">
                Table {table.number}
              </span>

              {/* Seats */}
              <span className="text-sm text-muted-foreground">
                {table.seats}
              </span>

              {/* Status badge + inline select */}
              <div className="relative">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-1.5 w-fit",
                    STATUS_STYLE[table.status],
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      STATUS_DOT[table.status],
                    )}
                  />
                  <span className="text-xs font-semibold">
                    {STATUS_LABEL[table.status]}
                  </span>
                  <select
                    value={table.status}
                    onChange={(e) =>
                      updateTableStatus(table.id, e.target.value as TableStatus)
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    aria-label={`Change status for Table ${table.number}`}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                  <svg
                    className="h-3 w-3 shrink-0 opacity-60"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
