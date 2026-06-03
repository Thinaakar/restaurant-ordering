export interface PermissionItem {
  key: string;
  label: string;
}

export interface PermissionModuleGroup {
  key: string;
  label: string;
  permissions: PermissionItem[];
}

export const PERMISSION_MODULES: PermissionModuleGroup[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    permissions: [{ key: 'dashboard.view', label: 'View Dashboard' }],
  },
  {
    key: 'orders',
    label: 'Orders',
    permissions: [
      { key: 'orders.view', label: 'View Orders' },
      { key: 'orders.create', label: 'Create Orders' },
      { key: 'orders.edit', label: 'Edit Orders' },
      { key: 'orders.cancel', label: 'Cancel Orders' },
    ],
  },
  {
    key: 'menu_management',
    label: 'Menu Management',
    permissions: [
      { key: 'menu.view', label: 'View Menu' },
      { key: 'menu.create', label: 'Create Menu Items' },
      { key: 'menu.edit', label: 'Edit Menu Items' },
      { key: 'menu.delete', label: 'Delete Menu Items' },
    ],
  },
  {
    key: 'table_management',
    label: 'Table Management',
    permissions: [
      { key: 'tables.view', label: 'View Tables' },
      { key: 'tables.create', label: 'Create Tables' },
      { key: 'tables.edit', label: 'Edit Tables' },
      { key: 'tables.delete', label: 'Delete Tables' },
      { key: 'tables.change_status', label: 'Change Table Status' },
    ],
  },
  {
    key: 'kitchen',
    label: 'Kitchen Board',
    permissions: [
      { key: 'kitchen.view', label: 'View Kitchen Board' },
      { key: 'kitchen.update_status', label: 'Update Order Status' },
    ],
  },
  {
    key: 'cashier',
    label: 'Cashier',
    permissions: [
      { key: 'cashier.view_bills', label: 'View Bills' },
      { key: 'cashier.generate_bills', label: 'Generate Bills' },
      { key: 'cashier.mark_payment', label: 'Mark Payment Complete' },
    ],
  },
  {
    key: 'reports',
    label: 'Reports & Analytics',
    permissions: [
      { key: 'reports.view', label: 'View Reports' },
      { key: 'reports.export', label: 'Export Reports' },
    ],
  },
  {
    key: 'user_management',
    label: 'User Management',
    permissions: [
      { key: 'users.view', label: 'View Users' },
      { key: 'users.create', label: 'Create Users' },
      { key: 'users.edit', label: 'Edit Users' },
      { key: 'users.delete', label: 'Delete Users' },
    ],
  },
  {
    key: 'roles',
    label: 'Roles',
    permissions: [
      { key: 'roles.view', label: 'View Roles' },
      { key: 'roles.create', label: 'Create Roles' },
      { key: 'roles.edit', label: 'Edit Roles' },
      { key: 'roles.delete', label: 'Delete Roles' },
    ],
  },
  {
    key: 'permissions',
    label: 'Permissions',
    permissions: [
      { key: 'permissions.view', label: 'View Permissions' },
      { key: 'permissions.assign', label: 'Assign Permissions' },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    permissions: [
      { key: 'settings.view', label: 'View Settings' },
      { key: 'settings.update', label: 'Update Settings' },
    ],
  },
];

export const ALL_PERMISSION_KEYS: string[] = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.key)
);

export function getModulePermissionKeys(moduleKey: string): string[] {
  const mod = PERMISSION_MODULES.find((m) => m.key === moduleKey);
  return mod?.permissions.map((p) => p.key) ?? [];
}
