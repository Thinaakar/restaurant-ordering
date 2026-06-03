'use client';

import React, { useState, useMemo } from 'react';
import { useTables } from '@/hooks/use-tables';
import { cn } from '@/lib/utils';
import {
  Grid3X3,
  Users,
  MapPin,
  Check,
  Search,
} from 'lucide-react';

interface TableSelectionProps {
  onTableSelect: (tableId: string, tableNumber: number) => void;
}

export function TableSelection({ onTableSelect }: TableSelectionProps) {
  const { tables } = useTables();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const floors = useMemo(() => {
    const set = new Set(tables.map((t) => t.floor));
    return Array.from(set).sort();
  }, [tables]);

  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchesFloor = floorFilter === 'all' || t.floor === floorFilter;
      const matchesSearch =
        searchTerm === '' ||
        t.number.toString().includes(searchTerm) ||
        t.status.includes(searchTerm.toLowerCase());
      return matchesFloor && matchesSearch;
    });
  }, [tables, floorFilter, searchTerm]);

  const selectedTable = tables.find((t) => t.id === selectedTableId);


  const handleConfirmSelect = () => {
    if (selectedTable && selectedTable.status === 'available') {
      onTableSelect(selectedTable.id, selectedTable.number);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
            <Grid3X3 className="h-5 w-5 text-gold" />
            Select a Table
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Choose an available table to begin taking the order
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-2 border border-border/50 rounded-lg text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50 w-40"
            />
          </div>
        </div>
      </div>

      {/* Floor Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Floor:</span>
        <button
          onClick={() => setFloorFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
            floorFilter === 'all'
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'bg-surface-2 text-muted-foreground hover:text-foreground'
          )}
        >
          All
        </button>
        {floors.map((f) => (
          <button
            key={f}
            onClick={() => setFloorFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
              floorFilter === f
                ? 'bg-gold/15 text-gold border border-gold/30'
                : 'bg-surface-2 text-muted-foreground hover:text-foreground'
            )}
          >
            Floor {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Table Grid */}
        <div className="xl:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredTables.map((table) => {
              const isSelected = selectedTableId === table.id;
              const isAvailable = table.status === 'available';

              return (
                <button
                  key={table.id}
                  onClick={() => isAvailable && setSelectedTableId(table.id)}
                  disabled={!isAvailable}
                  className={cn(
                    'relative p-5 rounded-xl border-2 text-center transition-all duration-300 group overflow-hidden',
                    isSelected
                      ? 'border-gold bg-gold/10 ring-2 ring-gold/40 scale-[1.02] shadow-lg shadow-gold/10'
                      : isAvailable
                        ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:scale-[1.02] cursor-pointer'
                        : table.status === 'occupied'
                          ? 'border-red-500/20 bg-red-500/5 opacity-50 cursor-not-allowed'
                          : 'border-amber-500/20 bg-amber-500/5 opacity-50 cursor-not-allowed'
                  )}
                >
                  {/* Top status bar */}
                  <div
                    className={cn(
                      'absolute top-0 left-0 right-0 h-1 transition-all',
                      isSelected ? 'bg-gold' :
                        table.status === 'available' ? 'bg-emerald-500' :
                          table.status === 'occupied' ? 'bg-red-500' : 'bg-amber-500'
                    )}
                  />

                  {/* Selected check */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-black animate-scale-in">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div className="text-3xl mb-2">
                    {table.status === 'available' ? '🪑' :
                      table.status === 'occupied' ? '👥' : '🧹'}
                  </div>

                  <div className="text-xl font-bold text-foreground">Table {table.number}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    <Users className="inline h-3 w-3 mr-0.5" />
                    {table.seats} seats
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    <MapPin className="inline h-3 w-3 mr-0.5" />
                    Floor {table.floor}
                  </div>

                  <div
                    className={cn(
                      'mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block',
                      table.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : table.status === 'occupied'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                    )}
                  >
                    {table.status}
                  </div>
                </button>
              );
            })}

            {filteredTables.length === 0 && (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <Grid3X3 className="h-12 w-12 mx-auto opacity-20 mb-3" />
                <p className="text-sm font-medium">No tables found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Selection Detail Panel */}
        <div className="xl:col-span-1">
          <div className="rounded-xl border border-border/50 bg-card p-5 sticky top-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Table Details
            </h3>

            {!selectedTable ? (
              <div className="text-center py-10 text-muted-foreground">
                <div className="text-5xl mb-3 opacity-30">🪑</div>
                <p className="text-xs font-medium">Select an available table</p>
                <p className="text-[10px] mt-1">Click on a green table to begin</p>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center p-5 rounded-xl bg-gold/5 border border-gold/20">
                  <div className="text-4xl mb-2">🪑</div>
                  <h4 className="text-xl font-bold text-gold">Table {selectedTable.number}</h4>
                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center justify-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      {selectedTable.seats} seat capacity
                    </p>
                    <p className="flex items-center justify-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Floor {selectedTable.floor}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleConfirmSelect}
                  className="w-full py-3 gold-gradient text-black rounded-xl font-bold uppercase tracking-wider text-sm hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Assign & Start Order
                </button>

                <button
                  onClick={() => setSelectedTableId(null)}
                  className="w-full py-2 bg-surface-2 text-muted-foreground rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-surface-3 transition"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          Available – Ready for new guests
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          Occupied – Currently serving
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          Cleaning – Being prepared
        </div>
      </div>
    </div>
  );
}
