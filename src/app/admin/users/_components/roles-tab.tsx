'use client';

import React, { useState } from 'react';
import { X, Shield, Users, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role, PermissionAction, PermissionModule } from '@/data/types';
import { ALL_MODULES, ALL_ACTIONS } from '@/data/mock-users';

const ROLE_COLORS: Record<string, { badge: string; dot: string }> = {
  amber:   { badge: 'bg-amber-100 text-amber-800 border-amber-200',   dot: 'bg-amber-500' },
  orange:  { badge: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-500' },
  blue:    { badge: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500' },
  green:   { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
};

/* ── Permission Drawer ── */
function PermissionsDrawer({ role, onClose }: { role: Role; onClose: () => void }) {
  const hasAction = (mod: string, action: string) =>
    role.permissions.some(p => p.module === mod && p.actions.includes(action as PermissionAction));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-stone-200 animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className={cn('h-3 w-3 rounded-full', ROLE_COLORS[role.color]?.dot)} />
            <div>
              <h2 className="text-sm font-bold text-stone-900">{role.label} — Permissions</h2>
              <p className="text-[11px] text-stone-400">{role.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider text-stone-500 text-[10px]">Module</th>
                  {ALL_ACTIONS.map(a => (
                    <th key={a.key} className="px-3 py-2.5 text-center font-bold uppercase tracking-wider text-stone-500 text-[10px]">{a.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {ALL_MODULES.map(mod => (
                  <tr key={mod.key} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-stone-700 whitespace-nowrap">{mod.label}</td>
                    {ALL_ACTIONS.map(action => (
                      <td key={action.key} className="px-3 py-2.5 text-center">
                        <span className={cn('inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold mx-auto',
                          hasAction(mod.key, action.key)
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-300 border border-stone-200')}>
                          {hasAction(mod.key, action.key) ? '✓' : '–'}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Roles Tab ── */
export function RolesTab({ roles, getUserCountByRole }: { roles: Role[]; getUserCountByRole: (name: string) => number }) {
  const [drawer, setDrawer] = useState<Role | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50 flex items-center gap-2">
          <Shield className="h-4 w-4 text-stone-400" />
          <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">System Roles</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                {['Role', 'Description', 'Users', 'Modules', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {roles.map(role => {
                const colors = ROLE_COLORS[role.color] ?? ROLE_COLORS.blue;
                const count = getUserCountByRole(role.name);
                return (
                  <tr key={role.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={cn('h-2.5 w-2.5 rounded-full', colors.dot)} />
                        <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', colors.badge)}>{role.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500 max-w-xs">{role.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-stone-400" />
                        <span className="text-xs font-semibold text-stone-700">{count}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-stone-600">{role.permissions.length} modules</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setDrawer(role)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors">
                          <Shield className="h-3 w-3" /> View Permissions
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors">
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {drawer && <PermissionsDrawer role={drawer} onClose={() => setDrawer(null)} />}
    </div>
  );
}
