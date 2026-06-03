'use client';

import React, { useState, useMemo } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useMenu } from '@/hooks/use-menu';
import type { MenuItem } from '@/data/types';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import {
  Search,
  Plus,
  Minus,
  X,
} from 'lucide-react';

export function MenuBrowser() {
  const { items: menuItems } = useMenu();
  const { items, addItem, updateQuantity } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.isAvailable) return false;
      if (vegOnly && !item.isVeg) return false;

      return (
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [menuItems, searchTerm, vegOnly]);

  const getCartQuantity = (menuItemId: string): number => {
    const cartItem = items.find((i) => i.menuItem.id === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddItem = (item: MenuItem) => {
    addItem(item, 1);
  };

  const handleDecrement = (item: MenuItem) => {
    const qty = getCartQuantity(item.id);
    if (qty > 0) {
      updateQuantity(item.id, qty - 1);
    }
  };

  const handleIncrement = (item: MenuItem) => {
    const qty = getCartQuantity(item.id);
    if (qty > 0) {
      updateQuantity(item.id, qty + 1);
    } else {
      addItem(item, 1);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-foreground">
          Menu
          {searchTerm && (
            <span className="text-xs text-muted-foreground font-normal ml-1">
              — searching "{searchTerm}"
            </span>
          )}
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {filteredItems.length} items
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-surface-2 border border-border/50 rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={cn(
            'px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all',
            vegOnly
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-surface-2 border-border/50 text-muted-foreground hover:text-foreground'
          )}
        >
          Veg Only
        </button>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/45 px-4 py-3 text-xs text-muted-foreground">
        <span className="font-bold uppercase tracking-wider">All available menu items</span>
        <span>{filteredItems.length} dishes</span>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto opacity-20 mb-3" />
            <p className="text-sm font-medium">No items found</p>
            <p className="text-xs mt-1">Try a different search or filter</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const cartQty = getCartQuantity(item.id);
            const isInCart = cartQty > 0;

            return (
              <div
                key={item.id}
                className={cn(
                  'relative rounded-xl border p-4 transition-all duration-300 group overflow-hidden',
                  isInCart
                    ? 'border-gold/40 bg-gold/5 shadow-sm shadow-gold/5'
                    : 'border-border/40 bg-card/40 hover:border-border/80 hover:bg-card/80'
                )}
              >
                {/* In-cart indicator */}
                {isInCart && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 gold-gradient" />
                )}

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                  <p className="text-sm font-bold text-gold">{formatCurrency(item.price)}</p>

                  {isInCart ? (
                    <div className="flex items-center gap-1.5 bg-surface-2 rounded-lg border border-border/30">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition rounded-l-lg hover:bg-surface-3"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-bold text-gold min-w-[28px] text-center">
                        {cartQty}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition rounded-r-lg hover:bg-surface-3"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddItem(item)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold/10 border border-gold/25 text-gold hover:bg-gold hover:text-black transition-all duration-300 text-xs font-bold uppercase tracking-wider"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

