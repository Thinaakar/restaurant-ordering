'use client';

import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/data/types';
import type { RoleFormData } from '@/providers/user-management-provider';
import { PermissionsMatrix } from './permissions-matrix';
import { ALL_PERMISSION_KEYS } from '@/data/permission-modules';

interface RoleFormModalProps {
  mode: 'create' | 'edit';
  role?: Role;
  onClose: () => void;
  onSave: (data: RoleFormData) => void;
}

export function RoleFormModal({ mode, role, onClose, onSave }: RoleFormModalProps) {
  const [form, setForm] = useState<RoleFormData>({
    label: role?.label ?? '',
    description: role?.description ?? '',
    status: role?.status ?? 'active',
    permissions: role?.permissions ?? [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.label.trim()) e.label = 'Role name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(form);
    onClose();
  };

  const grantAll = () => onChangePermissions([...ALL_PERMISSION_KEYS]);
  const clearAll = () => onChangePermissions([]);

  const onChangePermissions = (permissions: string[]) => {
    setForm((p) => ({ ...p, permissions }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className="bg-card border border-border/60 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
              <Shield className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {mode === 'create' ? 'Create Role' : 'Edit Role'}
              </h2>
              <p className="text-xs text-muted-foreground">Configure role details and permissions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Role Name
              </label>
              <input
                value={form.label}
                onChange={(e) => {
                  setForm((p) => ({ ...p, label: e.target.value }));
                  setErrors((p) => {
                    const n = { ...p };
                    delete n.label;
                    return n;
                  });
                }}
                disabled={role?.isSystem && role.name === 'super_admin'}
                placeholder="e.g. Manager"
                className={cn(
                  'w-full px-3 py-2.5 rounded-lg border text-sm bg-background outline-none transition-all',
                  errors.label ? 'border-destructive ring-2 ring-destructive/20' : 'border-border focus:border-gold focus:ring-2 focus:ring-gold/20'
                )}
              />
              {errors.label && <p className="text-[11px] text-destructive">{errors.label}</p>}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => {
                  setForm((p) => ({ ...p, description: e.target.value }));
                  setErrors((p) => {
                    const n = { ...p };
                    delete n.description;
                    return n;
                  });
                }}
                rows={2}
                placeholder="Describe what this role can do..."
                className={cn(
                  'w-full px-3 py-2.5 rounded-lg border text-sm bg-background outline-none resize-none transition-all',
                  errors.description ? 'border-destructive ring-2 ring-destructive/20' : 'border-border focus:border-gold focus:ring-2 focus:ring-gold/20'
                )}
              />
              {errors.description && <p className="text-[11px] text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as RoleFormData['status'] }))}
                className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-background focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={grantAll}
                className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-gold/30 text-gold bg-gold/5 hover:bg-gold/10 transition-colors"
              >
                Grant All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Permissions
            </p>
            <PermissionsMatrix selected={form.permissions} onChange={onChangePermissions} />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border/40 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-gold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
          >
            {mode === 'create' ? 'Create Role' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
