'use client';

import React from 'react';
import { ChefHat, Check, ClipboardList, ArrowLeft } from 'lucide-react';

interface OrderConfirmationModalProps {
  orderId: string;
  tableNumber: number;
  onClose: () => void;
  onViewOrders: () => void;
}

export function OrderConfirmationModal({
  orderId,
  tableNumber,
  onClose,
  onViewOrders,
}: OrderConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-6 relative overflow-hidden shadow-2xl animate-scale-in text-center">
        {/* Top gold bar banner decorative */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold gold-gradient" />

        {/* Success Icon Animation block */}
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 relative">
          <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-pulse" />
          <Check className="h-7 w-7" />
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h3 className="font-display font-bold text-xl text-gold">Order Sent to Kitchen!</h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Order for <strong className="text-foreground">Table {tableNumber}</strong> has been successfully registered and pushed to the live kitchen board.
          </p>
        </div>

        {/* Order Details badge ticket */}
        <div className="p-3.5 rounded-xl bg-surface-2/50 border border-border/40 text-xs space-y-1 font-mono uppercase tracking-wider">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Order Ticket</span>
            <span>Live Queue</span>
          </div>
          <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border/10">
            <span>Ticket ID:</span>
            <span className="text-gold font-bold">#{orderId.slice(0, 10)}</span>
          </div>
        </div>

        {/* Actions buttons */}
        <div className="space-y-2">
          <button
            onClick={onViewOrders}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-[1.01] hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 shadow-md cursor-pointer"
          >
            <ClipboardList className="h-4 w-4" />
            View Active Orders Queue
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/65 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-surface-2 transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Take Another Order
          </button>
        </div>
      </div>
    </div>
  );
}
