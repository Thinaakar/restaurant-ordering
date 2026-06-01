'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { RestaurantTable, TableStatus } from '@/data/types';
import { mockTables } from '@/data/mock-tables';

interface TablesContextType {
  tables: RestaurantTable[];
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

  useEffect(() => {
    const storedTables = localStorage.getItem('aura_tables');
    if (storedTables) {
      try {
        const parsed = JSON.parse(storedTables);
        if (Array.isArray(parsed) && parsed.length === 6) {
          setTables(parsed);
        } else {
          setTables(mockTables);
          localStorage.setItem('aura_tables', JSON.stringify(mockTables));
        }
      } catch (e) {
        setTables(mockTables);
      }
    } else {
      setTables(mockTables);
    }
  }, []);

  const saveTables = (updatedTables: RestaurantTable[]) => {
    setTables(updatedTables);
    localStorage.setItem('aura_tables', JSON.stringify(updatedTables));
  };

  const occupyTable = (tableId: string, orderId: string) => {
    const updated = tables.map((t) =>
      t.id === tableId ? { ...t, status: 'occupied' as TableStatus, currentOrderId: orderId } : t
    );
    saveTables(updated);
  };

  const freeTable = (tableId: string) => {
    const updated = tables.map((t) => {
      if (t.id === tableId) {
        const { currentOrderId, ...rest } = t;
        return { ...rest, status: 'available' as TableStatus };
      }
      return t;
    });
    saveTables(updated);
  };

  const setCleaningStatus = (tableId: string) => {
    const updated = tables.map((t) => {
      if (t.id === tableId) {
        const { currentOrderId, ...rest } = t;
        return { ...rest, status: 'cleaning' as TableStatus };
      }
      return t;
    });
    saveTables(updated);
  };

  const updateTableStatus = (tableId: string, status: TableStatus) => {
    const updated = tables.map((t) => {
      if (t.id === tableId) {
        if (status === 'available' || status === 'cleaning') {
          const { currentOrderId, ...rest } = t;
          return { ...rest, status };
        }
        return { ...t, status };
      }
      return t;
    });
    saveTables(updated);
  };

  const addTable = (number: number, seats: number, floor: number) => {
    const newTable: RestaurantTable = {
      id: `t-${Date.now()}`,
      number,
      seats,
      floor,
      status: 'available',
    };
    saveTables([...tables, newTable]);
  };

  const deleteTable = (tableId: string) => {
    saveTables(tables.filter((t) => t.id !== tableId));
  };

  return (
    <TablesContext.Provider value={{ tables, occupyTable, freeTable, setCleaningStatus, updateTableStatus, addTable, deleteTable }}>
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
