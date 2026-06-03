'use client';

import React, { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/data/types';

const ROLE_COLORS: Record<string, { badge: string; dot: string }> = {
  purple: { badge: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300', dot: 'bg-purple-500' },
  amber: { badge: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  orange: { badge: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-500' },
  blue: { badge: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  green: { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  rose: { badge: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
  cyan: { badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', dot: 'bg-cyan-500' },
};

function StatusBadge({ status }: { status: Role['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
        status === 'active'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-muted text-muted-foreground border-border'
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground')} />
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}

interface RolesTableProps {
  roles: Role[];
  getUserCountByRole: (name: string) => number;
  onCreate: () => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RolesTable({ roles, getUserCountByRole, onCreate, onEdit, onDelete }: RolesTableProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
    );
  }, [roles, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Create Role
        </button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border/60">
                {['Role Name', 'Description', 'Users Count', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((role) => {
                const colors = ROLE_COLORS[role.color] ?? ROLE_COLORS.blue;
                const count = getUserCountByRole(role.name);
                return (
                  <tr key={role.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={cn('h-2.5 w-2.5 rounded-full shrink-0', colors.dot)} />
                        <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', colors.badge)}>
                          {role.label}
                        </span>
                        {role.isSystem && (
                          <span className="text-[10px] font-medium text-muted-foreground uppercase">System</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs">{role.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold">{count}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={role.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(role)}
                          className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        {!role.isSystem && (
                          <button
                            type="button"
                            onClick={() => onDelete(role)}
                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            <Shield className="h-8 w-8 mx-auto mb-2 opacity-40" />
            No roles found
          </div>
        )}
      </div>
    </div>
  );
}
