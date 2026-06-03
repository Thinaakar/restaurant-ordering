'use client';

import React, { useMemo, useState } from 'react';
import { useTables } from '@/hooks/use-tables';
import type { TableStatus } from '@/data/types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STATUS_STYLE: Record<TableStatus, string> = {
  available: 'text-emerald   border-emerald/25   bg-emerald/8',
  occupied: 'text-red-400   border-red-400/25   bg-red-400/8',
  cleaning: 'text-amber-400 border-amber-400/25 bg-amber-400/8',
};

const STATUS_DOT: Record<TableStatus, string> = {
  available: 'bg-emerald',
  occupied: 'bg-red-400',
  cleaning: 'bg-amber-400',
};

const STATUS_LABEL: Record<TableStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  cleaning: 'Cleaning',
};

export default function AdminTablesPage() {
  const { tables, loading, addTable, deleteTable, updateTableStatus } = useTables();
  const [isOpen, setIsOpen] = useState(false);
  const [formNumber, setFormNumber] = useState('');
  const [formSeats, setFormSeats] = useState('');
  const [formFloor, setFormFloor] = useState('1');
  const [formError, setFormError] = useState('');

  const displayTables = useMemo(
    () => [...tables].sort((a, b) => a.floor - b.floor || a.number - b.number),
    [tables],
  );

  const handleOpenAdd = () => {
    const nextNumber =
      displayTables.length > 0
        ? Math.max(...displayTables.map((t) => t.number)) + 1
        : 1;
    setFormNumber(String(nextNumber));
    setFormSeats('4');
    setFormFloor('1');
    setFormError('');
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const number = parseInt(formNumber, 10);
    const seats = parseInt(formSeats, 10);
    const floor = parseInt(formFloor, 10);

    if (!Number.isFinite(number) || number < 1) {
      setFormError('Enter a valid table number.');
      return;
    }
    if (!Number.isFinite(seats) || seats < 1) {
      setFormError('Enter a valid seat count.');
      return;
    }
    if (!Number.isFinite(floor) || floor < 1) {
      setFormError('Enter a valid floor number.');
      return;
    }
    if (displayTables.some((t) => t.number === number && t.floor === floor)) {
      setFormError(`Table ${number} already exists on floor ${floor}.`);
      return;
    }

    addTable(number, seats, floor);
    setIsOpen(false);
  };

  const handleDelete = (id: string, tableNumber: number) => {
    if (confirm(`Delete Table ${tableNumber}? This cannot be undone.`)) {
      deleteTable(id);
    }
  };

  return (
    <div className="animate-fade-in w-full h-full flex flex-col max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/20 pb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight uppercase">
            Table Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create tables and update availability status
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-105 transition duration-300 shadow-md cursor-pointer shrink-0"
        >
          Add Table
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-border/40 flex-1 flex flex-col min-h-[320px]">
        <div className="grid grid-cols-[1fr_1fr_0.75fr_1.25fr_0.75fr] bg-surface-2/60 border-b border-border/40 px-6 py-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Table Number
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Seats
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Floor
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Status
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70 text-right">
            Actions
          </span>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">Loading tables…</p>
          ) : displayTables.length === 0 ? (
            <div className="px-6 py-12 text-center space-y-3">
              <p className="text-sm text-muted-foreground">No tables yet.</p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="text-xs font-bold uppercase tracking-wider text-gold hover:underline"
              >
                Add your first table
              </button>
            </div>
          ) : (
            displayTables.map((table, idx) => (
              <div
                key={table.id}
                className={cn(
                  'grid grid-cols-[1fr_1fr_0.75fr_1.25fr_0.75fr] items-center px-6 py-4 transition-colors duration-150',
                  idx !== displayTables.length - 1 && 'border-b border-border/25',
                  'hover:bg-surface-2/30',
                )}
              >
                <span className="text-sm font-semibold text-foreground">Table {table.number}</span>
                <span className="text-sm text-muted-foreground">{table.seats}</span>
                <span className="text-sm text-muted-foreground">{table.floor}</span>

                <div className="relative">
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-1.5 w-fit',
                      STATUS_STYLE[table.status],
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', STATUS_DOT[table.status])} />
                    <span className="text-xs font-semibold">{STATUS_LABEL[table.status]}</span>
                    <select
                      value={table.status}
                      onChange={(e) => updateTableStatus(table.id, e.target.value as TableStatus)}
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
                      <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(table.id, table.number)}
                    className="px-2.5 py-1.5 rounded-lg border border-border bg-card/50 text-[10px] font-bold uppercase hover:border-destructive hover:text-destructive transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-card border border-border text-foreground max-w-md p-6 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-center font-display font-semibold text-lg">
                Add Table
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 my-2 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="table-number" className="font-bold text-muted-foreground">
                    Table #
                  </label>
                  <input
                    id="table-number"
                    type="number"
                    min={1}
                    required
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="table-seats" className="font-bold text-muted-foreground">
                    Seats
                  </label>
                  <input
                    id="table-seats"
                    type="number"
                    min={1}
                    required
                    value={formSeats}
                    onChange={(e) => setFormSeats(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="table-floor" className="font-bold text-muted-foreground">
                    Floor
                  </label>
                  <input
                    id="table-floor"
                    type="number"
                    min={1}
                    required
                    value={formFloor}
                    onChange={(e) => setFormFloor(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-[11px] font-medium text-destructive">{formError}</p>
              )}

              <DialogFooter className="pt-2 flex flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-border bg-card/65 py-2.5 text-[11px] font-semibold uppercase hover:bg-surface-2 transition cursor-pointer text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gold py-2.5 text-[11px] font-bold uppercase tracking-wider text-black gold-gradient transition cursor-pointer shadow-md"
                >
                  Create Table
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
