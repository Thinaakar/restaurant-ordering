'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order, OrderItem, OrderStatus, PaymentStatus } from '@/data/types';
import { mockOrders } from '@/data/mock-orders';
import { useTables } from './use-tables';
import { generateOrderId } from '@/lib/formatters';

interface OrdersContextType {
  orders: Order[];
  placeOrder: (tableId: string, tableNumber: number, items: OrderItem[], notes?: string) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  cancelOrder: (orderId: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { occupyTable, setCleaningStatus } = useTables();

  useEffect(() => {
    const storedOrders = localStorage.getItem('aura_orders');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (e) {
        setOrders(mockOrders);
      }
    } else {
      setOrders(mockOrders);
    }
  }, []);

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('aura_orders', JSON.stringify(updatedOrders));
  };

  const placeOrder = (tableId: string, tableNumber: number, items: OrderItem[], notes?: string): string => {
    const newOrderId = generateOrderId();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + tax;

    const newOrder: Order = {
      id: newOrderId,
      tableId,
      tableNumber,
      items,
      status: 'pending',
      paymentStatus: 'pending',
      subtotal,
      tax,
      total,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveOrders([newOrder, ...orders]);
    occupyTable(tableId, newOrderId);
    return newOrderId;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) {
        const updatedOrder = { ...ord, status, updatedAt: new Date().toISOString() };
        // Sync with table state
        if (status === 'completed') {
          setCleaningStatus(ord.tableId);
        }
        return updatedOrder;
      }
      return ord;
    });
    saveOrders(updated);
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    const updated = orders.map((ord) =>
      ord.id === orderId ? { ...ord, paymentStatus, updatedAt: new Date().toISOString() } : ord
    );
    saveOrders(updated);
  };

  const cancelOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (ord) {
      setCleaningStatus(ord.tableId);
    }
    const updated = orders.filter((o) => o.id !== orderId);
    saveOrders(updated);
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, updateOrderStatus, updatePaymentStatus, cancelOrder }}>
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
