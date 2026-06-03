'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Order, OrderItem, OrderStatus, PaymentStatus } from '@/data/types';
import { apiJson } from '@/lib/http/client';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  refresh: () => Promise<void>;
  placeOrder: (tableId: string, tableNumber: number, items: OrderItem[], notes?: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  cancelOrder: (orderId: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiJson<Order[]>('/api/orders');
      setOrders(data);
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const placeOrder = async (
    tableId: string,
    tableNumber: number,
    items: OrderItem[],
    notes?: string,
  ): Promise<string> => {
    const created = await apiJson<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ tableId, tableNumber, items, notes }),
    });
    setOrders((prev) => [created, ...prev]);
    return created.id;
  };

  const patchOrder = async (orderId: string, patch: { status?: OrderStatus; paymentStatus?: PaymentStatus }) => {
    const updated = await apiJson<Order>(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    void patchOrder(orderId, { status });
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    void patchOrder(orderId, { paymentStatus });
  };

  const cancelOrder = (orderId: string) => {
    void apiJson(`/api/orders/${orderId}`, { method: 'DELETE' }).then(() =>
      setOrders((prev) => prev.filter((o) => o.id !== orderId)),
    );
  };

  return (
    <OrdersContext.Provider
      value={{ orders, loading, refresh, placeOrder, updateOrderStatus, updatePaymentStatus, cancelOrder }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
