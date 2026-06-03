'use client';

import React, { useState } from 'react';
import { useTables } from '@/hooks/use-tables';
import { useCart } from '@/hooks/use-cart';
import { useOrders } from '@/hooks/use-orders';
import { useToast } from '@/hooks/use-toast';
import { mockMenuItems } from '@/data/mock-menu';
import type { MenuItem } from '@/data/types';
import { ShoppingCart, Plus, Minus, X, Check, ChefHat, Search, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import Link from 'next/link';

export default function WaiterOrderingPage() {
  const { tables } = useTables();
  const { items, tableId, tableNumber, selectTable, addItem, removeItem, updateQuantity, clearCart, subtotal, tax, total, itemCount } = useCart();
  const { placeOrder } = useOrders();
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const selectedTable = tables.find((t) => t.id === tableId);
  
  // Filter menu items
  const filteredItems = mockMenuItems.filter((item) => {
    if (!item.isAvailable) return false;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handlePlaceOrder = () => {
    if (!tableId || !tableNumber || items.length === 0) return;

    const orderItems = items.map((item) => ({
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
      specialInstructions: specialInstructions || undefined,
    }));

    void placeOrder(tableId, tableNumber, orderItems, specialInstructions || undefined).then(() => {
    addToast({
      title: 'Order Placed Successfully',
      description: `Order for Table ${tableNumber} sent to kitchen queue`,
      type: 'success',
    });
    
    setOrderPlaced(true);
    clearCart();
    setSpecialInstructions('');
    
    setTimeout(() => setOrderPlaced(false), 3000);
    });
  };

  if (!tableId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
        <div className="text-6xl">🪑</div>
        <h2 className="text-2xl font-display font-semibold text-foreground">No Table Selected</h2>
        <p className="text-muted-foreground max-w-md">
          Please select a table first to start taking orders
        </p>
        <Link href="/waiter/tables">
          <button className="px-6 py-3 bg-gold text-black rounded-lg font-bold uppercase tracking-wider hover:bg-gold/90 transition flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Select Table
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success overlay */}
      {orderPlaced && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl border border-emerald-500/50 p-10 text-center animate-scale-in shadow-2xl">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gold mb-2">Order Placed!</h3>
            <p className="text-sm text-muted-foreground">Order sent to kitchen queue</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">

          {/* Header with Table Info */}
          <div className="glass rounded-xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Table {selectedTable?.number}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedTable?.seats} seats • Floor {selectedTable?.floor}
                  </p>
                </div>
              </div>
              <Link href="/waiter/tables">
                <button className="px-4 py-2 bg-surface-2 text-muted-foreground rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-surface-3 transition">
                  Change Table
                </button>
              </Link>
            </div>
          </div>

          {/* Menu Section */}
          <div className="glass rounded-xl border border-border/50 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Menu
              </h2>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {filteredItems.length} items
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border/50 rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/45 px-4 py-3 text-xs text-muted-foreground">
              <span className="font-bold uppercase tracking-wider">All available menu items</span>
              <span>{filteredItems.length} dishes</span>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <ChefHat className="h-12 w-12 mx-auto opacity-30 mb-4" />
                  <p className="text-sm">No items found</p>
                  <p className="text-xs mt-1">Try a different search</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const cartItem = items.find((i) => i.menuItem.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="border border-border/50 rounded-xl p-4 bg-surface-1/30 hover:border-gold/30 transition-all"
                    >
                      <div className="space-y-1.5 mb-3">
                        <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <p className="font-bold text-gold">{formatCurrency(item.price)}</p>
                        {cartItem ? (
                          <div className="flex items-center gap-2 bg-surface-2 rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.id, cartItem.quantity - 1)} 
                              className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-sm font-bold">{cartItem.quantity}</span>
                            <button 
                              onClick={() => addItem(item, 1)} 
                              className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(item, 1)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/25 text-gold hover:bg-gold hover:text-black transition text-xs font-bold"
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
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border/50 bg-card p-5 sticky top-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-gold" />
                Cart
              </h3>
              {itemCount > 0 && (
                <span className="text-xs bg-gold text-black px-2 py-0.5 rounded-full font-bold">{itemCount}</span>
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
                <div className="space-y-3 border-t border-border/50 pt-3">
                  {items.map((item) => (
                    <div key={item.menuItem.id} className="space-y-1 p-3 rounded-lg bg-surface-1/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{item.menuItem.name}</p>
                          <p className="text-[10px] text-gold">{formatCurrency(item.menuItem.price)}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.menuItem.id)} 
                          className="text-muted-foreground hover:text-destructive transition shrink-0"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-surface-2 rounded">
                          <button 
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)} 
                            className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)} 
                            className="px-2 py-1 text-muted-foreground hover:text-foreground transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-foreground">{formatCurrency(item.menuItem.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Special Instructions</label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="No onions, extra spicy, allergies..."
                    className="w-full bg-surface-2 border border-border/50 rounded-lg p-2 text-xs text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:border-gold/50"
                    rows={2}
                  />
                </div>

                <div className="space-y-1.5 border-t border-border/50 pt-3 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (5%)</span><span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gold border-t border-border/30 pt-2">
                    <span>Total</span><span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!tableId || items.length === 0}
                    className="w-full py-2.5 bg-gold text-black rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Place Order
                  </button>
                  <button
                    onClick={() => { clearCart(); setSpecialInstructions(''); }}
                    className="w-full py-2 bg-surface-2 text-muted-foreground rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-surface-3 transition"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

