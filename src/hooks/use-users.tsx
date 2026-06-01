'use client';

import { useState, useCallback } from 'react';
import { MOCK_USERS, MOCK_ROLES } from '@/data/mock-users';
import type { ManagedUser, Role, UserRole, UserStatus } from '@/data/types';

export interface NewUserForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  status: UserStatus;
}

export interface EditUserForm {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

export function useUsers() {
  const [users, setUsers] = useState<ManagedUser[]>(MOCK_USERS);
  const [roles] = useState<Role[]>(MOCK_ROLES);

  const addUser = useCallback((form: NewUserForm) => {
    const newUser: ManagedUser = {
      id: `usr_${Date.now()}`,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      role: form.role,
      status: form.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatar: form.role === 'admin' ? '👨‍💼'
        : form.role === 'kitchen_chef' ? '👩‍🍳'
        : form.role === 'waiter' ? '🧑‍🍽️'
        : '👨‍💻',
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  }, []);

  const updateUser = useCallback((id: string, form: EditUserForm) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, ...form, updatedAt: new Date().toISOString() } : u
      )
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toISOString() }
          : u
      )
    );
  }, []);

  const getUserById = useCallback(
    (id: string) => users.find((u) => u.id === id) ?? null,
    [users]
  );

  const getUserCountByRole = useCallback(
    (roleName: string) => users.filter((u) => u.role === roleName).length,
    [users]
  );

  return { users, roles, addUser, updateUser, deleteUser, toggleStatus, getUserById, getUserCountByRole };
}
