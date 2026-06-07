'use client';

import React, { useState } from 'react';
import { useUserManagement } from '@/providers/user-management-provider';
import { SuperAdminGuard } from '@/components/user-management/super-admin-guard';
import { RolesTable } from '@/components/user-management/roles-table';
import { RoleFormModal } from '@/components/user-management/role-form-modal';
import { DeleteConfirmModal } from '@/components/user-management/delete-confirm-modal';
import type { Role } from '@/data/types';
import type { RoleFormData } from '@/providers/user-management-provider';

function RolesSettingsContent() {
  const { roles, getUserCountByRole, addRole, updateRole, deleteRole } = useUserManagement();
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; role?: Role } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const handleSave = (data: RoleFormData) => {
    if (modal?.mode === 'create') {
      addRole(data);
    } else if (modal?.role) {
      updateRole(modal.role.id, data);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const ok = deleteRole(deleteTarget.id);
    if (!ok) {
      setDeleteError('Cannot delete: role is system-defined or has assigned users.');
      return;
    }
    setDeleteTarget(null);
    setDeleteError('');
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70 mb-2 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-gold/60" />
          Roles
        </h2>
        <p className="text-sm text-muted-foreground">
          Create and manage roles with granular permission assignments.
        </p>
      </div>

      <RolesTable
        roles={roles}
        getUserCountByRole={getUserCountByRole}
        onCreate={() => setModal({ mode: 'create' })}
        onEdit={(role) => setModal({ mode: 'edit', role })}
        onDelete={(role) => {
          setDeleteError('');
          setDeleteTarget(role);
        }}
      />

      {modal && (
        <RoleFormModal
          mode={modal.mode}
          role={modal.role}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <>
          <DeleteConfirmModal
            title="Delete Role"
            message={`Are you sure you want to delete "${deleteTarget.label}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            onClose={() => {
              setDeleteTarget(null);
              setDeleteError('');
            }}
          />
          {deleteError && (
            <p className="text-sm text-destructive font-medium mt-2">{deleteError}</p>
          )}
        </>
      )}
    </section>
  );
}

export function RolesSettingsSection() {
  return (
    <SuperAdminGuard>
      <RolesSettingsContent />
    </SuperAdminGuard>
  );
}
