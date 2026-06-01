'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus, PaymentStatus, RestaurantTable } from '@/data/types';

interface ToastType {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toasts: ToastType[];
  addToast: (toast: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = useCallback((toast: Omit<ToastType, 'id'>) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastType = { id, duration: 3000, type: 'info', ...toast };
    
    setToasts((prev) => [...prev, newToast]);
    
    if (newToast.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 animate-slide-up',
              toast.type === 'success' && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
              toast.type === 'error' && 'bg-destructive/10 border-destructive/20 text-destructive',
              toast.type === 'warning' && 'bg-amber-500/10 border-amber-500/20 text-amber-400',
              toast.type === 'info' && 'bg-blue-500/10 border-blue-500/20 text-blue-400',
            )}
          >
            <div className="flex-1">
              <h4 className="text-sm font-bold uppercase tracking-wider">{toast.title}</h4>
              {toast.description && <p className="text-xs mt-1 opacity-80">{toast.description}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current opacity-50 hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
