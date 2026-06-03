'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, MenuItem } from '@/data/types';
import { TAX_RATE } from '@/lib/constants';

interface CartContextType {
  items: CartItem[];
  tableId: string | null;
  tableNumber: number | null;
  selectTable: (tableId: string, tableNumber: number) => void;
  addItem: (menuItem: MenuItem, quantity: number, specialInstructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);

  // Load cart from sessionStorage to persist across page reloads during dining
  useEffect(() => {
    const storedCart = sessionStorage.getItem('yumm_cart');
    const storedTableId = sessionStorage.getItem('yumm_cart_table_id');
    const storedTableNum = sessionStorage.getItem('yumm_cart_table_num');

    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (e) {}
    }
    if (storedTableId) setTableId(storedTableId);
    if (storedTableNum) setTableNumber(parseInt(storedTableNum, 10));
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    sessionStorage.setItem('yumm_cart', JSON.stringify(newItems));
  };

  const selectTable = (id: string, num: number) => {
    setTableId(id);
    setTableNumber(num);
    sessionStorage.setItem('yumm_cart_table_id', id);
    sessionStorage.setItem('yumm_cart_table_num', num.toString());
  };

  const addItem = (menuItem: MenuItem, quantity: number, specialInstructions?: string) => {
    const existingIndex = items.findIndex((i) => i.menuItem.id === menuItem.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
      if (specialInstructions) {
        updated[existingIndex].specialInstructions = specialInstructions;
      }
    } else {
      updated = [...items, { menuItem, quantity, specialInstructions }];
    }
    saveCart(updated);
  };

  const removeItem = (menuItemId: string) => {
    const updated = items.filter((i) => i.menuItem.id !== menuItemId);
    saveCart(updated);
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    const updated = items.map((i) =>
      i.menuItem.id === menuItemId ? { ...i, quantity } : i
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    // Keep tableId selection unless specifically resetting dining
  };

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        tableId,
        tableNumber,
        selectTable,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
