'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Role, PermissionAction } from '@/data/types';
import { ALL_MODULES, ALL_ACTIONS } from '@/data/mock-users';

const ROLE_COLORS: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export function PermissionsTab({ roles }: { roles: Role[] }) {
  const [selectedRole, setSelectedRole] = useState<string>(roles[0]?.id ?? '');

  const role = roles.find(r => r.id === selectedRole);

  const hasAction = (mod: string, action: string) =>
    role?.permissions.some(p => p.module === mod && p.actions.includes(action as PermissionAction)) ?? false;

  const countGranted = (mod: string) =>
    ALL_ACTIONS.filter(a => hasAction(mod, a.key)).length;

  return (
    <div className="space-y-4">
      {/* Role selector */}
      <div className="flex flex-wrap gap-2">
        {roles.map(r => (
          <button key={r.id} onClick={() => setSelectedRole(r.id)}
            className={cn('px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200',
              selectedRole === r.id
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                : cn('border', ROLE_COLORS[r.color] ?? 'bg-stone-100 text-stone-700 border-stone-200', 'hover:opacity-80'))}>
            {r.label}
          </button>
        ))}
      </div>

      {role && (
        <div className="space-y-3">
          {/* Role info */}
          <div className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 bg-stone-50/60">
            <div className="flex-1">
              <p className="text-sm font-bold text-stone-900">{role.label}</p>
              <p className="text-xs text-stone-500 mt-0.5">{role.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">Modules with access</p>
              <p className="text-lg font-bold text-stone-900">{role.permissions.length}<span className="text-xs font-normal text-stone-400"> / {ALL_MODULES.length}</span></p>
            </div>
          </div>

          {/* Matrix */}
          <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-500 w-48">Module</th>
                    {ALL_ACTIONS.map(a => (
                      <th key={a.key} className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-stone-500">{a.label}</th>
                    ))}
                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-stone-500">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {ALL_MODULES.map(mod => {
                    const granted = countGranted(mod.key);
                    const hasAny = granted > 0;
                    return (
                      <tr key={mod.key} className={cn('transition-colors', hasAny ? 'hover:bg-amber-50/30' : 'hover:bg-stone-50/50 opacity-60')}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={cn('h-2 w-2 rounded-full shrink-0', hasAny ? 'bg-emerald-500' : 'bg-stone-300')} />
                            <span className="text-xs font-semibold text-stone-700">{mod.label}</span>
                          </div>
                        </td>
                        {ALL_ACTIONS.map(action => {
                          const checked = hasAction(mod.key, action.key);
                          return (
                            <td key={action.key} className="px-4 py-3 text-center">
                              <div className={cn(
                                'inline-flex h-6 w-6 items-center justify-center rounded-md border mx-auto text-[11px] font-bold transition-colors',
                                checked
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                                  : 'bg-stone-100 border-stone-200 text-stone-300'
                              )}>
                                {checked ? '✓' : ''}
                              </div>
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-center">
                          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full',
                            granted === 4 ? 'bg-emerald-100 text-emerald-700' :
                            granted > 0 ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-400')}>
                            {granted === 0 ? 'None' : `${granted}/${ALL_ACTIONS.length}`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 px-1 text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 rounded border bg-emerald-100 border-emerald-300 flex items-center justify-center text-[9px] text-emerald-700 font-bold">✓</div>
              <span>Permission granted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-4 w-4 rounded border bg-stone-100 border-stone-200" />
              <span>No access</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
