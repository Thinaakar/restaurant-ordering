'use client';

import React, { useState } from 'react';
import { useTables } from '@/hooks/use-tables';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Users, MapPin, Clock, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TableSelectionPage() {
  const { tables, occupyTable } = useTables();
  const { selectTable, tableId, clearCart } = useCart();
  const { addToast } = useToast();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const selectedTable = tables.find(t => t.id === selectedTableId);

  const handleTableSelect = (id: string, number: number) => {
    if (tables.find(t => t.id === id)?.status !== 'available') return;
    setSelectedTableId(id);
  };

  const handleBookTable = () => {
    if (!selectedTableId || !selectedTable) return;
    
    // Clear any existing cart
    clearCart();
    
    // Select table in cart context
    selectTable(selectedTableId, selectedTable.number);
    
    // Show success message
    addToast({
      title: 'Table Selected',
      description: `Table ${selectedTable.number} is ready for ordering`,
      type: 'success',
    });
  };

  const availableTables = tables.filter(t => t.status === 'available');
  const occupiedTables = tables.filter(t => t.status === 'occupied');
  const cleaningTables = tables.filter(t => t.status === 'cleaning');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🪑</span>
          <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
            Table Selection
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Select an available table to start taking orders
        </p>
      </div>

      {/* Table Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-lg border border-emerald/30 bg-emerald-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{availableTables.length}</p>
          <p className="text-xs uppercase tracking-widest text-emerald-300">Available</p>
        </div>
        <div className="glass rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{occupiedTables.length}</p>
          <p className="text-xs uppercase tracking-widest text-blue-300">Occupied</p>
        </div>
        <div className="glass rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{cleaningTables.length}</p>
          <p className="text-xs uppercase tracking-widest text-amber-300">Cleaning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Grid */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gold" />
              Restaurant Floor Plan
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => handleTableSelect(table.id, table.number)}
                  disabled={table.status !== 'available'}
                  className={cn(
                    'p-6 rounded-xl border-2 transition-all duration-300 text-center relative overflow-hidden group',
                    selectedTableId === table.id
                      ? 'border-gold bg-gold/10 ring-2 ring-gold/50'
                      : table.status === 'available'
                        ? 'border-emerald/40 bg-emerald-500/5 hover:border-emerald hover:bg-emerald-500/10 hover:scale-105'
                        : table.status === 'occupied'
                          ? 'border-blue-500/40 bg-blue-500/5 opacity-60 cursor-not-allowed'
                          : 'border-amber-500/40 bg-amber-500/5 opacity-60 cursor-not-allowed',
                  )}
                >
                  {/* Status indicator */}
                  <div className={cn(
                    'absolute top-0 left-0 right-0 h-1',
                    table.status === 'available' ? 'bg-emerald' :
                    table.status === 'occupied' ? 'bg-blue-500' : 'bg-amber-500'
                  )} />
                  
                  {/* Table icon */}
                  <div className="text-3xl mb-2">
                    {table.status === 'available' ? '🪑' : 
                     table.status === 'occupied' ? '👥' : '🧹'}
                  </div>
                  
                  {/* Table details */}
                  <div className="text-2xl font-bold text-foreground mb-1">
                    Table {table.number}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {table.seats} seats • Floor {table.floor}
                  </div>
                  <div className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full',
                    table.status === 'available' ? 'bg-emerald/20 text-emerald' :
                    table.status === 'occupied' ? 'bg-blue-500/20 text-blue-400' : 
                    'bg-amber-500/20 text-amber-400'
                  )}>
                    {table.status}
                  </div>

                  {/* Selection indicator */}
                  {selectedTableId === table.id && (
                    <div className="absolute top-2 right-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-black">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Panel */}
        <div className="lg:col-span-1">
          <div className="glass rounded-xl border border-border/50 p-6 sticky top-6">
            <h3 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" />
              Table Details
            </h3>

            {!selectedTable ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-6xl mb-4 opacity-30">🪑</div>
                <p className="text-sm">Select a table to continue</p>
                <p className="text-xs mt-1">Choose from available tables above</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Selected table info */}
                <div className="text-center p-6 rounded-lg bg-gold/10 border border-gold/30">
                  <div className="text-4xl mb-3">🪑</div>
                  <h4 className="text-xl font-bold text-gold mb-2">
                    Table {selectedTable.number}
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4" />
                      {selectedTable.seats} seats capacity
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Floor {selectedTable.floor}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4" />
                      Available now
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  {tableId ? (
                    <Link href="/waiter" className="block">
                      <button className="w-full py-3 bg-gold text-black rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-gold/90 transition flex items-center justify-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Continue to Menu
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={handleBookTable}
                      className="w-full py-3 bg-gold text-black rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-gold/90 transition flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Select Table
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedTableId(null)}
                    className="w-full py-2 bg-surface-2 text-muted-foreground rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-surface-3 transition"
                  >
                    Clear Selection
                  </button>
                </div>

                {/* Table features */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Table Features</h5>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald">✓</span>
                      Window view available
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald">✓</span>
                      High-speed WiFi
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald">✓</span>
                      Mobile charging ports
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="glass rounded-lg border border-border/50 p-4">
        <h4 className="text-sm font-bold text-foreground mb-3">Table Status Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald"></div>
            <span className="text-muted-foreground">Available - Ready for new customers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-muted-foreground">Occupied - Currently serving customers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-muted-foreground">Cleaning - Being prepared for next service</span>
          </div>
        </div>
      </div>
    </div>
  );
}