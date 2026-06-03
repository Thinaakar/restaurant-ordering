'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useUsers } from '@/hooks/use-users';
import { UsersTab } from './_components/users-tab';

export default function UserManagementPage() {
  const { users, roles, addUser, updateUser, deleteUser, toggleStatus } = useUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage staff accounts and access levels.</p>
      </div>


      {/* Users table — no tabs, direct render */}
      <UsersTab
        users={users}
        roles={roles}
        onAdd={addUser}
        onUpdate={updateUser}
        onDelete={deleteUser}
        onToggle={toggleStatus}
      />
    </div>
  );
}
