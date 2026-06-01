import React from 'react';
import { ShoppingCart, Check, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';

interface CartSummaryProps {
  itemCount: number;
  items: Array<{
    menuItem: { id: string; name: string; price: number };
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  specialInstructions: string;
  onSpecialInstructionsChange: (value: string) => void;
  onPlaceOrder: () => void;
  onClearCart: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
}

export function CartSummary({
  itemCount,
  items,
  subtotal,
  tax,
  total,
  specialInstructions,
  onSpecialInstructionsChange,
  onPlaceOrder,
  onClearCart,
  isLoading = false,
  disabled = false,
  onRemoveItem,
  onUpdateQuantity,
}: CartSummaryProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 sticky top-6 max-h-[90vh] overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-gold" />
          Cart
        </h3>
        {itemCount > 0 && (
          <span className="text-xs bg-gold text-black px-2 py-0.5 rounded-full font-bold">
            {itemCount}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground space-y-2">
          <ChefHat className="h-8 w-8 mx-auto opacity-30" />
          <p className="text-xs">Cart is empty</p>
          <p className="text-[10px]">Add items from menu to get started</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3 border-t border-border/50 pt-3">
            {items.map((item) => (
              <div key={item.menuItem.id} className="space-y-1 p-3 rounded-lg bg-surface-1/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {item.menuItem.name}
                    </p>
                    <p className="text-[10px] text-gold">
                      {formatCurrency(item.menuItem.price)}
                    </p>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem(item.menuItem.id)}
                      className="text-muted-foreground hover:text-destructive transition shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {onUpdateQuantity && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-surface-2 rounded">
                      <button
                        onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
                      >
                        −
                      </button>
                      <span className="px-2 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs font-bold text-foreground">
                      {formatCurrency(item.menuItem.price * item.quantity)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Special Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => onSpecialInstructionsChange(e.target.value)}
              placeholder="No onions, extra spicy, allergies..."
              className="w-full bg-surface-2 border border-border/50 rounded-lg p-2 text-xs text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-gold/50"
              rows={2}
            />
          </div>

          {/* Totals */}
          <div className="space-y-1.5 border-t border-border/50 pt-3 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-gold border-t border-border/30 pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onPlaceOrder}
              disabled={disabled || isLoading || items.length === 0}
              className={cn(
                'w-full py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition',
                disabled || isLoading
                  ? 'bg-surface-2 text-muted-foreground opacity-50 cursor-not-allowed'
                  : 'bg-gold text-black hover:bg-gold/90'
              )}
            >
              <Check className="h-4 w-4" />
              {isLoading ? 'Placing...' : 'Place Order'}
            </button>
            <button
              onClick={onClearCart}
              disabled={disabled || isLoading}
              className="w-full py-2 bg-surface-2 text-muted-foreground rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-surface-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}