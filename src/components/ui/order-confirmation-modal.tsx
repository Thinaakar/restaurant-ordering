import React from 'react';
import { Check, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  type: 'success' | 'pending' | 'error';
  title: string;
  message: string;
  orderNumber?: string;
  tableNumber?: number;
  itemCount?: number;
  totalAmount?: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function OrderConfirmationModal({
  isOpen,
  type,
  title,
  message,
  orderNumber,
  tableNumber,
  itemCount,
  totalAmount,
  onClose,
  actionLabel,
  onAction,
}: OrderConfirmationModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-12 w-12 text-emerald-400" />;
      case 'pending':
        return <Clock className="h-12 w-12 text-amber-400" />;
      case 'error':
        return <AlertCircle className="h-12 w-12 text-destructive" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/20 border-emerald-500/50';
      case 'pending':
        return 'bg-amber-500/20 border-amber-500/50';
      case 'error':
        return 'bg-destructive/20 border-destructive/50';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className={cn(
        'glass rounded-2xl border p-8 text-center animate-scale-in shadow-2xl max-w-md w-full mx-4',
        getBackgroundColor()
      )}>
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>

        {/* Title */}
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-muted-foreground mb-6">
          {message}
        </p>

        {/* Order Details */}
        {(orderNumber || tableNumber || itemCount || totalAmount) && (
          <div className="bg-surface-1/50 rounded-lg p-4 mb-6 space-y-2 text-sm">
            {orderNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-bold text-gold">{orderNumber}</span>
              </div>
            )}
            {tableNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Table:</span>
                <span className="font-bold text-foreground">#{tableNumber}</span>
              </div>
            )}
            {itemCount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items:</span>
                <span className="font-bold text-foreground">{itemCount}</span>
              </div>
            )}
            {totalAmount && (
              <div className="flex justify-between border-t border-border/30 pt-2">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-bold text-gold">{totalAmount}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className="flex-1 py-2.5 bg-gold text-black rounded-lg font-bold uppercase tracking-wider text-xs hover:bg-gold/90 transition"
            >
              {actionLabel}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                'flex-1 py-2.5 rounded-lg font-bold uppercase tracking-wider text-xs transition',
                onAction ? 'bg-surface-2 text-muted-foreground hover:bg-surface-3' : 'bg-gold text-black hover:bg-gold/90'
              )}
            >
              {onAction ? 'Close' : 'Done'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}