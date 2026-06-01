import React from 'react';
import { Check, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RestaurantTable } from '@/data/types';

interface TableSelectionCardProps {
  table: RestaurantTable;
  isSelected?: boolean;
  isDisabled?: boolean;
  onSelect?: (id: string, number: number) => void;
  showDetails?: boolean;
}

export function TableSelectionCard({
  table,
  isSelected = false,
  isDisabled = false,
  onSelect,
  showDetails = false,
}: TableSelectionCardProps) {
  const getStatusColor = () => {
    switch (table.status) {
      case 'available':
        return 'border-emerald/40 bg-emerald-500/5 hover:border-emerald hover:bg-emerald-500/10';
      case 'occupied':
        return 'border-blue-500/40 bg-blue-500/5 opacity-60 cursor-not-allowed';
      case 'cleaning':
        return 'border-amber-500/40 bg-amber-500/5 opacity-60 cursor-not-allowed';
      default:
        return 'border-border/30 bg-surface-2/20';
    }
  };

  const getStatusIndicatorColor = () => {
    switch (table.status) {
      case 'available':
        return 'bg-emerald';
      case 'occupied':
        return 'bg-blue-500';
      case 'cleaning':
        return 'bg-amber-500';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusTextColor = () => {
    switch (table.status) {
      case 'available':
        return 'text-emerald';
      case 'occupied':
        return 'text-blue-400';
      case 'cleaning':
        return 'text-amber-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (table.status) {
      case 'available':
        return '🪑';
      case 'occupied':
        return '👥';
      case 'cleaning':
        return '🧹';
      default:
        return '❓';
    }
  };

  if (showDetails) {
    return (
      <div className="glass rounded-xl border border-border/50 p-6">
        <div className="text-center p-6 rounded-lg bg-gold/10 border border-gold/30">
          <div className="text-4xl mb-3">{getStatusIcon()}</div>
          <h4 className="text-xl font-bold text-gold mb-2">Table {table.number}</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              {table.seats} seats capacity
            </p>
            <p className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              Floor {table.floor}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect?.(table.id, table.number)}
      disabled={isDisabled || table.status !== 'available'}
      className={cn(
        'p-6 rounded-xl border-2 transition-all duration-300 text-center relative overflow-hidden group',
        isSelected
          ? 'border-gold bg-gold/10 ring-2 ring-gold/50'
          : getStatusColor(),
        isDisabled && 'cursor-not-allowed'
      )}
    >
      {/* Status indicator */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', getStatusIndicatorColor())} />

      {/* Table icon */}
      <div className="text-3xl mb-2">{getStatusIcon()}</div>

      {/* Table details */}
      <div className="text-2xl font-bold text-foreground mb-1">{table.number}</div>
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
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-black">
            <Check className="h-4 w-4" />
          </div>
        </div>
      )}
    </button>
  );
}