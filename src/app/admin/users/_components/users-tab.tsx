'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, X, ChevronLeft, ChevronRight, Phone, Mail, Calendar, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RESTAURANT_EMAIL_DOMAIN } from '@/lib/constants';
import type { ManagedUser, Role, UserStatus } from '@/data/types';
import type { NewUserForm, EditUserForm } from '@/hooks/use-users';

/* ── helpers ── */
const ROLE_COLOR_BY_NAME: Record<string, string> = {
  super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-amber-100 text-amber-800 border-amber-200',
  kitchen_chef: 'bg-orange-100 text-orange-800 border-orange-200',
  waiter: 'bg-blue-100 text-blue-700 border-blue-200',
  cashier: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

function roleLabel(roleName: string, roles: Role[]): string {
  return roles.find((r) => r.name === roleName)?.label ?? roleName.replace(/_/g, ' ');
}

function roleBadgeClass(roleName: string): string {
  return ROLE_COLOR_BY_NAME[roleName] ?? 'bg-stone-100 text-stone-700 border-stone-200';
}

function defaultRoleName(roles: Role[]): string {
  const staff = roles.find((r) => r.name === 'waiter');
  return staff?.name ?? roles[0]?.name ?? 'waiter';
}
const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const PAGE_SIZE = 5;

/* ── Form field (module-level so inputs are not remounted on each keystroke) ── */
function UserFormField({
  label,
  id,
  type = 'text',
  value,
  name,
  placeholder,
  error,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  name: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-2.5 rounded-lg border text-sm bg-stone-50 text-stone-900 outline-none transition-all',
          error
            ? 'border-red-300 ring-2 ring-red-50'
            : 'border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-50',
        )}
      />
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
      status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200')}>
      <span className={cn('h-1.5 w-1.5 rounded-full', status === 'active' ? 'bg-emerald-500' : 'bg-stone-400')} />
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}

/* ── User Form Modal ── */
function UserFormModal({ mode, user, roles, onClose, onSave }: {
  mode: 'add' | 'edit';
  user?: ManagedUser;
  roles: Role[];
  onClose: () => void;
  onSave: (data: NewUserForm | EditUserForm) => void | Promise<unknown>;
}) {
  const assignableRoles = roles.filter((r) => r.status === 'active');
  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    password: '',
    confirmPassword: '',
    role: user?.role ?? defaultRoleName(assignableRoles),
    status: (user?.status ?? 'active') as UserStatus,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const set = (k: string, v: string) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => { const n = { ...p }; delete n[k]; return n; }); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (mode === 'add') {
      if (form.password.length < 8) e.password = 'Min 8 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaveError('');
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-bold text-stone-900">{mode === 'add' ? 'Add New User' : 'Edit User'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {saveError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{saveError}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <UserFormField label="Full Name" id="um-fullname" name="fullName" value={form.fullName} placeholder="Jane Smith" error={errors.fullName} onChange={(v) => set('fullName', v)} />
            <UserFormField label="Phone Number" id="um-phone" name="phone" value={form.phone} placeholder="+91 98000 00000" error={errors.phone} onChange={(v) => set('phone', v)} />
          </div>
          <UserFormField label="Email Address" id="um-email" name="email" type="email" value={form.email} placeholder={`jane@${RESTAURANT_EMAIL_DOMAIN}`} error={errors.email} onChange={(v) => set('email', v)} />
          {mode === 'add' && (
            <div className="grid grid-cols-2 gap-4">
              <UserFormField label="Password" id="um-pw" name="password" type="password" value={form.password} placeholder="Min 8 chars" error={errors.password} onChange={(v) => set('password', v)} />
              <UserFormField label="Confirm Password" id="um-cpw" name="confirmPassword" type="password" value={form.confirmPassword} placeholder="Re-enter" error={errors.confirmPassword} onChange={(v) => set('confirmPassword', v)} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Role</label>
              <select
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                disabled={assignableRoles.length === 0}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-200 text-sm bg-stone-50 text-stone-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 transition-all disabled:opacity-50"
              >
                {assignableRoles.length === 0 ? (
                  <option value="">No roles — add roles on Roles page</option>
                ) : (
                  assignableRoles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.label}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-200 text-sm bg-stone-50 text-stone-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 transition-all">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => void handleSave()} disabled={saving} className="px-5 py-2 text-sm font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-60">
            {saving ? 'Saving…' : mode === 'add' ? 'Create User' : 'Update User'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── View Modal ── */
function ViewModal({ user, roles, onClose }: { user: ManagedUser; roles: Role[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-bold text-stone-900">User Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 border border-stone-200 text-2xl">{user.avatar || '👤'}</div>
            <div>
              <p className="font-bold text-stone-900 text-base">{user.fullName}</p>
              <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border mt-1', roleBadgeClass(user.role))}>
                {roleLabel(user.role, roles)}
              </span>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { icon: Mail, label: 'Email', value: user.email },
              { icon: Phone, label: 'Phone', value: user.phone },
              { icon: Calendar, label: 'Created', value: fmt(user.createdAt) },
              { icon: RefreshCw, label: 'Updated', value: fmt(user.updatedAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-50 border border-stone-100">
                  <Icon className="h-3.5 w-3.5 text-stone-500" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-stone-800 font-medium text-xs">{value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-50 border border-stone-100">
                <span className="text-xs">⚡</span>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">Status</p>
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ── */
function DeleteModal({ user, onClose, onConfirm }: { user: ManagedUser; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-stone-200 p-6 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 border border-red-100 mx-auto">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-bold text-stone-900">Delete User</h3>
          <p className="text-sm text-stone-500">Remove <span className="font-semibold text-stone-700">{user.fullName}</span> from the system? This cannot be undone.</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Users Tab ── */
export function UsersTab({ users, roles, onAdd, onUpdate, onDelete, onToggle }: {
  users: ManagedUser[];
  roles: Role[];
  onAdd: (f: NewUserForm) => void | Promise<unknown>;
  onUpdate: (id: string, f: EditUserForm) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const activeRoles = useMemo(() => roles.filter((r) => r.status === 'active'), [roles]);
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [sortField, setSortField] = useState<'fullName' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | 'delete' | null>(null);
  const [selected, setSelected] = useState<ManagedUser | null>(null);

  const filtered = useMemo(() => {
    let list = [...users];
    if (search) list = list.filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter !== 'all') list = list.filter(u => u.role === roleFilter);
    if (statusFilter !== 'all') list = list.filter(u => u.status === statusFilter);
    list.sort((a, b) => {
      const va = a[sortField]; const vb = b[sortField];
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return list;
  }, [users, search, roleFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (f: typeof sortField) => { if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortField(f); setSortDir('asc'); } };
  const open = (m: typeof modal, u?: ManagedUser) => { setSelected(u ?? null); setModal(m); };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search users…"
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-200 bg-stone-50 text-stone-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 w-56 transition-all" />
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm rounded-lg border border-stone-200 bg-stone-50 text-stone-700 outline-none focus:border-amber-400 transition-all">
            <option value="all">All Roles</option>
            {activeRoles.map((r) => (
              <option key={r.id} value={r.name}>{r.label}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as UserStatus | 'all'); setPage(1); }}
            className="px-3 py-2 text-sm rounded-lg border border-stone-200 bg-stone-50 text-stone-700 outline-none focus:border-amber-400 transition-all">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button onClick={() => open('add')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors shadow-sm shrink-0">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                {[
                  { label: 'User', field: 'fullName' as const },
                  { label: 'Phone', field: null },
                  { label: 'Role', field: null },
                  { label: 'Status', field: null },
                  { label: 'Created', field: 'createdAt' as const },
                  { label: 'Actions', field: null },
                ].map(({ label, field }) => (
                  <th key={label}
                    onClick={() => field && toggleSort(field)}
                    className={cn('px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-stone-500 whitespace-nowrap', field && 'cursor-pointer hover:text-stone-800 select-none')}>
                    {label} {field && sortField === field && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-stone-400 text-sm">No users found</td></tr>
              ) : paginated.map(u => (
                <tr key={u.id} className="hover:bg-stone-50/60 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 border border-stone-200 text-sm shrink-0">{u.avatar || '👤'}</div>
                      <div>
                        <p className="font-semibold text-stone-900 text-xs">{u.fullName}</p>
                        <p className="text-[11px] text-stone-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-600 whitespace-nowrap">{u.phone}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-semibold border', roleBadgeClass(u.role))}>{roleLabel(u.role, roles)}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">{fmt(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => open('view', u)} title="View" className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"><Eye className="h-3.5 w-3.5" /></button>
                      <button onClick={() => open('edit', u)} title="Edit" className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-700 transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => onToggle(u.id)} title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-stone-400 hover:text-blue-700 transition-colors">
                        {u.status === 'active' ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => open('delete', u)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-stone-100 bg-stone-50/50">
          <p className="text-xs text-stone-500">{filtered.length} user{filtered.length !== 1 ? 's' : ''} · Page {page} of {totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={cn('h-7 w-7 text-xs rounded-lg border transition-colors', n === page ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 text-stone-600 hover:bg-stone-100')}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === 'add' && <UserFormModal key="add-user" mode="add" roles={roles} onClose={() => setModal(null)} onSave={d => onAdd(d as NewUserForm)} />}
      {modal === 'edit' && selected && <UserFormModal mode="edit" user={selected} roles={roles} onClose={() => setModal(null)} onSave={d => onUpdate(selected.id, d as EditUserForm)} />}
      {modal === 'view' && selected && <ViewModal user={selected} roles={roles} onClose={() => setModal(null)} />}
      {modal === 'delete' && selected && <DeleteModal user={selected} onClose={() => setModal(null)} onConfirm={() => { onDelete(selected.id); setModal(null); }} />}
    </div>
  );
}
