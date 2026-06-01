'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/formatters';
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartSidebarProps {
  onPlaceOrder: () => void;
  onClose?: () => void;
  isPanel?: boolean;
}

export function CartSidebar({ onPlaceOrder, onClose, isPanel = false }: CartSidebarProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount,
    tableNumber,
  } = useCart();

  const [notes, setNotes] = useState('');

  const handleUpdateQuantity = (itemId: string, currentQty: number, change: number) => {
    updateQuantity(itemId, currentQty + change);
  };

  const handlePlaceOrder = () => {
    onPlaceOrder();
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-card border-l border-border/50 text-foreground',
        isPanel ? 'rounded-xl border' : 'w-full'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-surface-1/55">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gold" />
          <div>
            <h3 className="font-display font-semibold text-sm">Table Order Cart</h3>
            {tableNumber && (
              <p className="text-[10px] text-gold font-bold uppercase tracking-wider">
                Table {tableNumber}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition"
              title="Clear Cart"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
            <span className="text-4xl mb-2">🍽️</span>
            <p className="text-xs font-semibold">Cart is Empty</p>
            <p className="text-[10px] mt-0.5">Select menu items to add to this order</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.menuItem.id}
              className="p-3 rounded-lg border border-border/40 bg-surface-2/30 space-y-2 hover:border-gold/25 transition duration-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-bold text-foreground truncate">
                      {item.menuItem.name}
                    </p>
                    {item.menuItem.isVeg && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-gold">{formatCurrency(item.menuItem.price)} each</p>
                </div>
                <button
                  onClick={() => removeItem(item.menuItem.id)}
                  className="text-muted-foreground hover:text-destructive transition p-1 hover:bg-destructive/10 rounded"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Quantity adjustments */}
              <div className="flex items-center justify-between pt-1 border-t border-border/10">
                <div className="flex items-center bg-surface-3 rounded-md border border-border/20">
                  <button
                    onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity, -1)}
                    className="p-1 text-muted-foreground hover:text-foreground transition hover:bg-surface-2 rounded-l-md"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-2.5 text-xs font-bold text-foreground min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity, 1)}
                    className="p-1 text-muted-foreground hover:text-foreground transition hover:bg-surface-2 rounded-r-md"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-xs font-bold text-foreground">
                  {formatCurrency(item.menuItem.price * item.quantity)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Special Instructions & Summary */}
      {items.length > 0 && (
        <div className="p-4 border-t border-border/50 bg-surface-1/45 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Special Instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, extra spicy, no ice, etc..."
              className="w-full bg-surface-2 border border-border/50 rounded-lg p-2 text-xs text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-gold/50"
              rows={2}
            />
          </div>

          <div className="space-y-1.5 text-xs border-t border-border/15 pt-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>GST Tax (5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-gold border-t border-border/25 pt-2">
              <span>Grand Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-3 bg-gold text-black rounded-xl font-bold uppercase tracking-wider text-xs hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Place & Send Order
          </button>
        </div>
      )}
    </div>
  );
}
