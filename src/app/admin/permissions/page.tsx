'use client';

import React, { useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserManagement } from '@/providers/user-management-provider';
import { SuperAdminGuard } from '@/components/user-management/super-admin-guard';
import { PermissionsMatrix } from '@/components/user-management/permissions-matrix';
import { PERMISSION_MODULES } from '@/data/permission-modules';

export default function PermissionsPage() {
  return (
    <SuperAdminGuard>
      <PermissionsPageContent />
    </SuperAdminGuard>
  );
}

function PermissionsPageContent() {
  const { roles, updateRolePermissions, refresh } = useUserManagement();
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? '');
  const [draftPermissions, setDraftPermissions] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const role = roles.find((r) => r.id === selectedRoleId);

  React.useEffect(() => {
    const r = roles.find((x) => x.id === selectedRoleId);
    if (r) {
      setDraftPermissions([...r.permissions]);
      setSaved(false);
    }
  }, [selectedRoleId, roles]);

  const handleSelectRole = (id: string) => {
    setSelectedRoleId(id);
    setSaved(false);
  };

  const handleSave = () => {
    if (!role) return;
    updateRolePermissions(role.id, draftPermissions);
    void refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalGranted = draftPermissions.length;
  const totalAvailable = PERMISSION_MODULES.reduce((n, m) => n + m.permissions.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-gold mb-1">
          <KeyRound className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">User Management</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Permissions Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and assign permissions grouped by module for each role.
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Select Role
            </p>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRole(r.id)}
                  className={cn(
                    'px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200',
                    selectedRoleId === r.id
                      ? 'bg-gold/15 text-gold border-gold/40 shadow-sm'
                      : 'border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {role && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">Granted</p>
                <p className="text-lg font-bold text-foreground">
                  {totalGranted}
                  <span className="text-xs font-normal text-muted-foreground"> / {totalAvailable}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={role.name === 'super_admin'}
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saved ? 'Saved!' : 'Save Permissions'}
              </button>
            </div>
          )}
        </div>

        {role && (
          <>
            <div className="rounded-xl border border-border/40 bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">{role.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
              {role.name === 'super_admin' && (
                <p className="text-xs text-gold mt-2 font-medium">
                  Super Admin has all permissions by default and cannot be modified.
                </p>
              )}
            </div>

            <PermissionsMatrix
              selected={draftPermissions}
              onChange={setDraftPermissions}
              readOnly={role.name === 'super_admin'}
            />
          </>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">All Permission Modules</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PERMISSION_MODULES.map((mod) => (
            <div
              key={mod.key}
              className="rounded-xl border border-border/40 bg-background/50 p-4 transition-colors hover:border-gold/20"
            >
              <p className="text-sm font-semibold text-foreground">{mod.label}</p>
              <ul className="mt-2 space-y-1">
                {mod.permissions.map((p) => (
                  <li key={p.key} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-gold/60" />
                    {p.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
