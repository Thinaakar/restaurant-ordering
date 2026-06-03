'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { MenuItem } from '@/data/types';
import { apiJson } from '@/lib/http/client';

interface MenuContextType {
  items: MenuItem[];
  loading: boolean;
  refresh: () => Promise<void>;
  createItem: (input: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
  updateItem: (id: string, patch: Partial<MenuItem>) => Promise<MenuItem | null>;
  deleteItem: (id: string) => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiJson<MenuItem[]>('/api/menu');
      setItems(data);
    } catch (e) {
      console.error('Failed to load menu', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createItem = useCallback(async (input: Omit<MenuItem, 'id'>) => {
    const created = await apiJson<MenuItem>('/api/menu', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    setItems((prev) => [...prev, created]);
    return created;
  }, []);

  const updateItem = useCallback(async (id: string, patch: Partial<MenuItem>) => {
    const updated = await apiJson<MenuItem>(`/api/menu/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
    return updated;
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    await apiJson(`/api/menu/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <MenuContext.Provider value={{ items, loading, refresh, createItem, updateItem, deleteItem }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
}
