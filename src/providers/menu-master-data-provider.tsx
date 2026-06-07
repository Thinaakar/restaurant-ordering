"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DishTypeMaster, SpiceLevelMaster } from "@/data/menu-master-data";
import { apiJson } from "@/lib/http/client";
import { useAuth } from "@/hooks/use-auth";

interface MenuMasterDataContextType {
  dishTypes: DishTypeMaster[];
  spiceLevels: SpiceLevelMaster[];
  activeDishTypes: DishTypeMaster[];
  activeSpiceLevels: SpiceLevelMaster[];
  loading: boolean;
  refresh: () => Promise<void>;
  addDishType: (input: { label: string; isVeg: boolean }) => Promise<DishTypeMaster>;
  updateDishType: (
    id: string,
    patch: Partial<Pick<DishTypeMaster, "label" | "isVeg" | "status">>,
  ) => Promise<void>;
  deleteDishType: (id: string) => Promise<boolean>;
  addSpiceLevel: (input: { label: string }) => Promise<SpiceLevelMaster>;
  updateSpiceLevel: (
    id: string,
    patch: Partial<Pick<SpiceLevelMaster, "label" | "status">>,
  ) => Promise<void>;
  deleteSpiceLevel: (id: string) => Promise<boolean>;
  getDishTypeLabel: (item: { dishTypeValue?: string; isVeg: boolean }) => string;
  getSpiceLevelLabel: (value: string) => string;
}

const MenuMasterDataContext = createContext<MenuMasterDataContextType | undefined>(
  undefined,
);

export function MenuMasterDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [dishTypes, setDishTypes] = useState<DishTypeMaster[]>([]);
  const [spiceLevels, setSpiceLevels] = useState<SpiceLevelMaster[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [dishData, spiceData] = await Promise.all([
        apiJson<DishTypeMaster[]>("/api/master-data/dish-types"),
        apiJson<SpiceLevelMaster[]>("/api/master-data/spice-levels"),
      ]);
      setDishTypes(dishData);
      setSpiceLevels(spiceData);
    } catch (e) {
      console.error("Failed to load menu master data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) void refresh();
    else {
      setDishTypes([]);
      setSpiceLevels([]);
      setLoading(false);
    }
  }, [user, refresh]);

  const activeDishTypes = useMemo(
    () => dishTypes.filter((d) => d.status === "active"),
    [dishTypes],
  );

  const activeSpiceLevels = useMemo(
    () => spiceLevels.filter((s) => s.status === "active"),
    [spiceLevels],
  );

  const addDishType = useCallback(
    async (input: { label: string; isVeg: boolean }) => {
      const created = await apiJson<DishTypeMaster>("/api/master-data/dish-types", {
        method: "POST",
        body: JSON.stringify({ ...input, status: "active" }),
      });
      setDishTypes((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const updateDishType = useCallback(
    async (
      id: string,
      patch: Partial<Pick<DishTypeMaster, "label" | "isVeg" | "status">>,
    ) => {
      const updated = await apiJson<DishTypeMaster>(`/api/master-data/dish-types/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setDishTypes((prev) => prev.map((d) => (d.id === id ? updated : d)));
    },
    [],
  );

  const deleteDishType = useCallback(async (id: string) => {
    try {
      await apiJson(`/api/master-data/dish-types/${id}`, { method: "DELETE" });
      setDishTypes((prev) => prev.filter((d) => d.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  const addSpiceLevel = useCallback(async (input: { label: string }) => {
    const created = await apiJson<SpiceLevelMaster>("/api/master-data/spice-levels", {
      method: "POST",
      body: JSON.stringify({ ...input, status: "active" }),
    });
    setSpiceLevels((prev) => [...prev, created]);
    return created;
  }, []);

  const updateSpiceLevel = useCallback(
    async (
      id: string,
      patch: Partial<Pick<SpiceLevelMaster, "label" | "status">>,
    ) => {
      const updated = await apiJson<SpiceLevelMaster>(
        `/api/master-data/spice-levels/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(patch),
        },
      );
      setSpiceLevels((prev) => prev.map((s) => (s.id === id ? updated : s)));
    },
    [],
  );

  const deleteSpiceLevel = useCallback(async (id: string) => {
    try {
      await apiJson(`/api/master-data/spice-levels/${id}`, { method: "DELETE" });
      setSpiceLevels((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  const getDishTypeLabel = useCallback(
    (item: { dishTypeValue?: string; isVeg: boolean }) => {
      if (item.dishTypeValue) {
        const match = dishTypes.find((d) => d.value === item.dishTypeValue);
        if (match) return match.label;
      }
      const fallback = dishTypes.find((d) => d.isVeg === item.isVeg);
      return fallback?.label ?? (item.isVeg ? "Veg" : "Non-veg");
    },
    [dishTypes],
  );

  const getSpiceLevelLabel = useCallback(
    (value: string) => {
      const match = spiceLevels.find((s) => s.value === value);
      return match?.label ?? value;
    },
    [spiceLevels],
  );

  return (
    <MenuMasterDataContext.Provider
      value={{
        dishTypes,
        spiceLevels,
        activeDishTypes,
        activeSpiceLevels,
        loading,
        refresh,
        addDishType,
        updateDishType,
        deleteDishType,
        addSpiceLevel,
        updateSpiceLevel,
        deleteSpiceLevel,
        getDishTypeLabel,
        getSpiceLevelLabel,
      }}
    >
      {children}
    </MenuMasterDataContext.Provider>
  );
}

export function useMenuMasterData() {
  const context = useContext(MenuMasterDataContext);
  if (context === undefined) {
    throw new Error("useMenuMasterData must be used within MenuMasterDataProvider");
  }
  return context;
}
