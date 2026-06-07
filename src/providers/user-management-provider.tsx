"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ManagedUser, Role, UserStatus, RoleStatus } from "@/data/types";
import { apiJson } from "@/lib/http/client";
import { useAuth } from "@/hooks/use-auth";

export interface NewUserForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  status: UserStatus;
}

export interface EditUserForm {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: UserStatus;
}

export interface RoleFormData {
  label: string;
  description: string;
  status: RoleStatus;
  permissions: string[];
}

interface UserManagementContextType {
  users: ManagedUser[];
  roles: Role[];
  loading: boolean;
  refresh: () => Promise<void>;
  addUser: (form: NewUserForm) => Promise<ManagedUser>;
  updateUser: (id: string, form: EditUserForm) => void;
  deleteUser: (id: string) => void;
  toggleStatus: (id: string) => void;
  getUserById: (id: string) => ManagedUser | null;
  getUserCountByRole: (roleName: string) => number;
  addRole: (form: RoleFormData) => Promise<Role>;
  updateRole: (id: string, form: RoleFormData) => void;
  deleteRole: (id: string) => Promise<boolean>;
  updateRolePermissions: (id: string, permissions: string[]) => void;
}

const UserManagementContext = createContext<
  UserManagementContextType | undefined
>(undefined);

export function UserManagementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const usersData = await apiJson<ManagedUser[]>("/api/users");
      setUsers(usersData);
      try {
        const rolesData = await apiJson<Role[]>("/api/roles");
        setRoles(rolesData.filter((r) => r.status === "active"));
      } catch {
        setRoles([]);
      }
    } catch (e) {
      console.error("Failed to load user management data", e);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user) void refresh();
    else {
      setUsers([]);
      setRoles([]);
      setLoading(false);
    }
  }, [user, refresh]);

  const addUser = useCallback(
    async (form: NewUserForm) => {
      const created = await apiJson<ManagedUser>("/api/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setUsers((prev) =>
        prev.some((u) => u.id === created.id) ? prev : [...prev, created],
      );
      await refresh();
      return created;
    },
    [refresh],
  );

  const updateUser = useCallback((id: string, form: EditUserForm) => {
    void apiJson<ManagedUser>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    }).then((updated) =>
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u))),
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    void apiJson(`/api/users/${id}`, { method: "DELETE" }).then(() =>
      setUsers((prev) => prev.filter((u) => u.id !== id)),
    );
  }, []);

  const toggleStatus = useCallback(
    (id: string) => {
      const u = users.find((x) => x.id === id);
      if (!u) return;
      updateUser(id, {
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status === "active" ? "inactive" : "active",
      });
    },
    [users, updateUser],
  );

  const getUserById = useCallback(
    (id: string) => users.find((u) => u.id === id) ?? null,
    [users],
  );

  const getUserCountByRole = useCallback(
    (roleName: string) => users.filter((u) => u.role === roleName).length,
    [users],
  );

  const addRole = useCallback(async (form: RoleFormData) => {
    const created = await apiJson<Role>("/api/roles", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setRoles((prev) => [...prev, created]);
    return created;
  }, []);

  const updateRole = useCallback((id: string, form: RoleFormData) => {
    void apiJson<Role>(`/api/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
    }).then((updated) =>
      setRoles((prev) => prev.map((r) => (r.id === id ? updated : r))),
    );
  }, []);

  const deleteRole = useCallback(async (id: string): Promise<boolean> => {
    try {
      await apiJson(`/api/roles/${id}`, { method: "DELETE" });
      setRoles((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateRolePermissions = useCallback(
    (id: string, permissions: string[]) => {
      void apiJson<Role>(`/api/roles/${id}/permissions`, {
        method: "PATCH",
        body: JSON.stringify({ permissions }),
      }).then((updated) =>
        setRoles((prev) => prev.map((r) => (r.id === id ? updated : r))),
      );
    },
    [],
  );

  return (
    <UserManagementContext.Provider
      value={{
        users,
        roles,
        loading,
        refresh,
        addUser,
        updateUser,
        deleteUser,
        toggleStatus,
        getUserById,
        getUserCountByRole,
        addRole,
        updateRole,
        deleteRole,
        updateRolePermissions,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const ctx = useContext(UserManagementContext);
  if (!ctx)
    throw new Error(
      "useUserManagement must be used within UserManagementProvider",
    );
  return ctx;
}

export function useUsers() {
  return useUserManagement();
}
