'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useOrders } from '@/hooks/use-orders';
import { formatCurrency } from '@/lib/formatters'; // Uses $ for USD in customer areas
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Trash2,
  Receipt,
  Check,
  ClipboardList,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function CartCheckoutPage() {
  const router = useRouter();
  const {
    items,
    tableId,
    tableNumber,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    tax,
    total,
  } = useCart();

  const { placeOrder } = useOrders();
  const [orderNotes, setOrderNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  // Redirect if no table selected
  useEffect(() => {
    if (!tableId) {
      router.push('/customer');
    }
  }, [tableId, router]);

  const handlePlaceOrder = () => {
    if (items.length === 0 || !tableId || tableNumber === null) return;

    setIsPlacing(true);

    // Map cart items to order items
    const orderItems = items.map((item) => ({
      menuItemId: item.menuItem.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions,
    }));

    // Simulating slight processing delay for a luxury premium experience
    setTimeout(() => {
      void placeOrder(tableId, tableNumber, orderItems, orderNotes).then((orderId) => {
        clearCart();
        setIsPlacing(false);
        router.push(`/customer/order-status?orderId=${orderId}`);
      }).catch(() => setIsPlacing(false));
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-surface-2 text-2xl text-muted-foreground border border-border">
          <UtensilsCrossed className="h-6 w-6 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-semibold">Your Cart is Empty</h2>
          <p className="text-sm text-muted-foreground">Select delicious recipes from our chef menu to begin dining.</p>
        </div>
        <Link href="/customer/menu">
          <button className="rounded-full bg-gold px-8 py-3 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-105 transition duration-300 shadow-md cursor-pointer mt-4">
            Browse Menu
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Header Back Button */}
      <div className="flex items-center gap-3">
        <Link href="/customer/menu" className="flex items-center justify-center h-10 w-10 rounded-full border border-border bg-card/65 text-muted-foreground hover:text-gold hover:border-gold transition">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight">Review Order</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Assigned to Table {tableNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Cart Items list & General Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/20 bg-surface-1/45">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Selected Dishes</h2>
            </div>
            
            <div className="divide-y divide-border/20 px-5">
              {items.map((item) => (
                <div key={item.menuItem.id} className="py-5 flex items-start gap-4">
                  {/* Emoji Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-2xl border border-border/25">
                    {item.menuItem.image}
                  </div>

                  {/* Body details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground truncate">{item.menuItem.name}</h3>
                      <span className="text-sm font-bold text-foreground shrink-0">
                        {formatCurrency(item.menuItem.price * item.quantity)}
                      </span>
                    </div>

                    {/* Special instruction notes in line */}
                    {item.specialInstructions && (
                      <p className="text-[10px] text-gold/80 bg-gold/5 border border-gold/10 px-2 py-0.5 rounded italic w-fit">
                        “{item.specialInstructions}”
                      </p>
                    )}

                    {/* Controls & Delete row */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-2 text-foreground font-semibold hover:border-gold hover:text-gold transition cursor-pointer text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-center w-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-2 text-foreground font-semibold hover:border-gold hover:text-gold transition cursor-pointer text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.menuItem.id)}
                        className="text-muted-foreground/50 hover:text-destructive transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Cooking Comments Box */}
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-gold" />
              <span>General Table Notes</span>
            </h2>
            <textarea
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Serve starters first, bring additional plates, allergy disclosures..."
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-2/45 p-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
            />
          </div>
        </div>

        {/* Right column: Billing Breakdown receipt */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6 relative overflow-hidden">
            {/* Top luxury line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold gold-gradient" />

            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4 text-gold" />
              <span>Bill Breakdown</span>
            </h2>

            {/* Calculations lines */}
            <div className="space-y-3.5 text-xs border-b border-border/20 pb-5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST & Restaurant Tax (5%)</span>
                <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-emerald">
                <span className="font-semibold">Service Charge</span>
                <span className="font-bold">FREE</span>
              </div>
            </div>

            {/* Total line */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm font-semibold">Grand Total</span>
              <span className="text-2xl font-bold font-display text-gold glow-gold">
                {formatCurrency(total)}
              </span>
            </div>

            {/* Submit checkout CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-lg py-4 text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 relative group overflow-hidden shadow-lg cursor-pointer select-none border border-transparent",
                isPlacing
                  ? "bg-border text-muted-foreground cursor-wait"
                  : "bg-gold gold-gradient hover:scale-[1.02] hover:shadow-gold/15"
              )}
            >
              {isPlacing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-black animate-pulse-glow" />
                  <span>Send to Chef Queue</span>
                </>
              )}
            </button>

            <div className="text-[10px] text-muted-foreground/60 text-center leading-relaxed mt-2 select-none">
              By confirming, your order will be submitted instantly to the kitchen display panel. You will settle the bill with the waiter upon dining completion.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
