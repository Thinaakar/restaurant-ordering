'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { RestaurantTable, TableStatus } from '@/data/types';
import { apiJson } from '@/lib/http/client';

interface TablesContextType {
  tables: RestaurantTable[];
  loading: boolean;
  refresh: () => Promise<void>;
  occupyTable: (tableId: string, orderId: string) => void;
  freeTable: (tableId: string) => void;
  setCleaningStatus: (tableId: string) => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;
  addTable: (number: number, seats: number, floor: number) => void;
  deleteTable: (tableId: string) => void;
}

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export function TablesProvider({ children }: { children: React.ReactNode }) {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiJson<RestaurantTable[]>('/api/tables');
      setTables(data);
    } catch (e) {
      console.error('Failed to load tables', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const patchTable = async (tableId: string, patch: Partial<RestaurantTable>) => {
    const updated = await apiJson<RestaurantTable>(`/api/tables/${tableId}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    setTables((prev) => prev.map((t) => (t.id === tableId ? updated : t)));
  };

  const occupyTable = (tableId: string, orderId: string) => {
    void patchTable(tableId, { status: 'occupied', currentOrderId: orderId });
  };

  const freeTable = (tableId: string) => {
    void patchTable(tableId, { status: 'available', currentOrderId: undefined });
  };

  const setCleaningStatus = (tableId: string) => {
    void patchTable(tableId, { status: 'cleaning', currentOrderId: undefined });
  };

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    const patch: Partial<RestaurantTable> = { status };
    if (status === 'available' || status === 'cleaning') {
      patch.currentOrderId = undefined;
    }
    void patchTable(tableId, patch);
  };

  const addTable = (number: number, seats: number, floor: number) => {
    void apiJson<RestaurantTable>('/api/tables', {
      method: 'POST',
      body: JSON.stringify({ number, seats, floor }),
    }).then((created) => setTables((prev) => [...prev, created]));
  };

  const deleteTable = (tableId: string) => {
    void apiJson(`/api/tables/${tableId}`, { method: 'DELETE' }).then(() =>
      setTables((prev) => prev.filter((t) => t.id !== tableId)),
    );
  };

  return (
    <TablesContext.Provider
      value={{
        tables,
        loading,
        refresh,
        occupyTable,
        freeTable,
        setCleaningStatus,
        updateTableStatus,
        addTable,
        deleteTable,
      }}
    >
      {children}
    </TablesContext.Provider>
  );
}

export function useTables() {
  const context = useContext(TablesContext);
  if (context === undefined) {
    throw new Error('useTables must be used within a TablesProvider');
  }
  return context;
}
