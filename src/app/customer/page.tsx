'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTables } from '@/hooks/use-tables';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import { RESTAURANT_NAME, TABLE_STATUS_CONFIG } from '@/lib/constants';
import { Armchair, Compass, ArrowRight } from 'lucide-react';

export default function TableSelectionPage() {
  const router = useRouter();
  const { tables } = useTables();
  const { selectTable, tableId: selectedTableId } = useCart();
  const [activeFloor, setActiveFloor] = useState<number>(1);

  // Filter tables by current floor
  const filteredTables = tables.filter((t) => t.floor === activeFloor);

  const handleSelectTable = (tableId: string, tableNumber: number) => {
    selectTable(tableId, tableNumber);
  };

  const handleProceed = () => {
    if (selectedTableId) {
      router.push('/customer/menu');
    }
  };

  const activeTable = tables.find((t) => t.id === selectedTableId);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Visual Header Banner */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
          <span>Interactive Dining Experience</span>
        </div>
        <h1 className="text-4xl font-display font-semibold tracking-tight text-foreground sm:text-5xl">
          Secure Your Table
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome to {RESTAURANT_NAME}. To begin browsing our luxury menu, please select your assigned table number below.
        </p>
      </div>

      {/* Floor selection tabs */}
      <div className="flex justify-center gap-4">
        {[1, 2].map((floor) => (
          <button
            key={floor}
            onClick={() => setActiveFloor(floor)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-300 cursor-pointer",
              activeFloor === floor
                ? "border-gold bg-gold/10 text-gold glow-gold"
                : "border-border bg-card/40 text-muted-foreground hover:border-border/80 hover:text-foreground"
            )}
          >
            <Compass className="h-4 w-4" />
            <span>Floor {floor}</span>
          </button>
        ))}
      </div>

      {/* Tables Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-scale-in">
        {filteredTables.map((table) => {
          const isSelected = selectedTableId === table.id;
          const status = table.status;
          const isOccupied = status === 'occupied';
          const isCleaning = status === 'cleaning';
          const config = TABLE_STATUS_CONFIG[status];

          return (
            <button
              key={table.id}
              onClick={() => !isOccupied && handleSelectTable(table.id, table.number)}
              disabled={isOccupied}
              className={cn(
                "relative group flex flex-col items-center justify-between p-6 rounded-xl border bg-card/65 transition-all duration-300 text-center cursor-pointer",
                isSelected
                  ? "border-gold ring-1 ring-gold/40 shadow-lg scale-105"
                  : isOccupied
                  ? "opacity-50 cursor-not-allowed border-border"
                  : "border-border/50 hover:border-gold/50 hover:shadow-md hover:-translate-y-0.5"
              )}
            >
              {/* Table top icon */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full mb-3 border transition-colors",
                  isSelected
                    ? "bg-gold/20 border-gold text-gold"
                    : isOccupied
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : isCleaning
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                )}
              >
                <Armchair className="h-5 w-5" />
              </div>

              {/* Details */}
              <div className="space-y-1">
                <span className="text-lg font-bold font-display text-foreground">
                  Table {table.number}
                </span>
                <p className="text-xs text-muted-foreground">{table.seats} Seats</p>
              </div>

              {/* Status Badge */}
              <span className={cn("mt-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold border", config.color)}>
                {isSelected ? 'Selected' : config.label}
              </span>

              {/* Selected highlight line */}
              {isSelected && (
                <span className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gold gold-gradient" />
              )}
            </button>
          );
        })}
      </div>

      {/* Proceed CTA */}
      <div className="flex flex-col items-center justify-center p-6 border border-border/40 rounded-2xl bg-card/25 gap-4">
        {selectedTableId ? (
          <div className="text-center space-y-1 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              You have selected <span className="font-bold text-gold">Table {activeTable?.number}</span>
            </p>
            <p className="text-xs text-muted-foreground/60">Ready to explore our culinary creations?</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Please select an available table to proceed with ordering.
          </p>
        )}

        <button
          onClick={handleProceed}
          disabled={!selectedTableId}
          className={cn(
            "flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all duration-300 cursor-pointer",
            selectedTableId
              ? "bg-gold text-black gold-gradient shadow-lg hover:shadow-gold/20 hover:scale-105"
              : "bg-border text-muted-foreground cursor-not-allowed"
          )}
        >
          <span>Start Ordering</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
