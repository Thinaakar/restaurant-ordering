'use client';

import React, { useState } from 'react';
import { Search, ArrowUp, ArrowDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: { key: keyof T | ((item: T) => any); label: string; align?: 'left' | 'center' | 'right' }[];
  searchKey?: keyof T;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  searchKey,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    if (searchKey) {
      const value = String((item as any)[searchKey]).toLowerCase();
      return value.includes(searchQuery.toLowerCase());
    }
    return Object.values(item as any).some(
      (val) => String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2/45 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-gold transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-3 py-2 text-xs font-bold uppercase text-muted-foreground hover:border-gold hover:text-gold transition">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/50 bg-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/20 bg-surface-1/45 text-muted-foreground font-bold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'px-5 py-3 cursor-pointer hover:bg-surface-2/50 transition',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right'
                  )}
                  onClick={() => handleSort(col.key as keyof T)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {sortedData.length > 0 ? (
              sortedData.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'hover:bg-surface-2/10 transition',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={cn('px-5 py-3', col.align === 'center' && 'text-center', col.align === 'right' && 'text-right')}>
                      {typeof col.key === 'function' ? col.key(item) : String(item[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-muted-foreground">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
