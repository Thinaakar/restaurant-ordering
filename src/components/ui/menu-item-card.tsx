import React from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import type { MenuItem } from '@/data/types';

interface MenuItemCardProps {
  item: MenuItem;
  quantity?: number;
  onAdd?: (item: MenuItem, quantity: number) => void;
  onRemove?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  isCompact?: boolean;
}

export function MenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
  onUpdateQuantity,
  isCompact = false,
}: MenuItemCardProps) {
  if (isCompact) {
    return (
      <div className="space-y-1 p-3 rounded-lg bg-surface-1/50">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
            <p className="text-[10px] text-gold">{formatCurrency(item.price)}</p>
          </div>
          {onRemove && quantity && (
            <button
              onClick={() => onRemove(item.id)}
              className="text-muted-foreground hover:text-destructive transition shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {quantity && onUpdateQuantity && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-surface-2 rounded">
              <button
                onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-2 text-xs font-bold">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs font-bold text-foreground">
              {formatCurrency(item.price * quantity)}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded-xl p-4 bg-surface-1/30 hover:border-gold/30 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-2xl border border-border/25">
          {item.image}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
            {item.isVeg && (
              <span className="text-[9px] font-bold text-emerald bg-emerald/10 border border-emerald/20 px-1.5 py-0.5 rounded-full shrink-0">
                VEG
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
            {item.description}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>⏱ {item.preparationTime}m</span>
            {item.spiceLevel && <span>🌶️ {item.spiceLevel}</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <p className="font-bold text-gold">{formatCurrency(item.price)}</p>
        {quantity ? (
          <div className="flex items-center gap-2 bg-surface-2 rounded-lg">
            <button
              onClick={() => onUpdateQuantity?.(item.id, quantity - 1)}
              className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-sm font-bold">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity?.(item.id, quantity + 1)}
              className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAdd?.(item, 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/25 text-gold hover:bg-gold hover:text-black transition text-xs font-bold"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}