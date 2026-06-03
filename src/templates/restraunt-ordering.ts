export type TemplateFieldType = 'string' | 'number' | 'boolean' | 'timestamp' | 'reference';

export type TemplateField = {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  refTable?: string;
};

export type TemplateTable = {
  key: string;
  label: string;
  order: number;
  fields: TemplateField[];
};

export const appTemplate = {
  key: 'restraunt-ordering',
  label: 'Restaurant Ordering',
  tables: [
    {
      key: 'tables',
      label: 'Restaurant Tables',
      order: 10,
      fields: [
        { key: 'number', label: 'Table Number', type: 'number', required: true },
        { key: 'seats', label: 'Seats', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'floor', label: 'Floor', type: 'number', required: true },
        { key: 'currentOrderId', label: 'Current Order', type: 'string' },
      ],
    },
    {
      key: 'menu_items',
      label: 'Menu Items',
      order: 20,
      fields: [
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'price', label: 'Price', type: 'number', required: true },
        { key: 'isAvailable', label: 'Available', type: 'boolean', required: true },
      ],
    },
    {
      key: 'orders',
      label: 'Orders',
      order: 30,
      fields: [
        { key: 'tableId', label: 'Table ID', type: 'string', required: true },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'total', label: 'Total', type: 'number', required: true },
      ],
    },
    {
      key: 'managed_users',
      label: 'Managed Users',
      order: 40,
      fields: [
        { key: 'fullName', label: 'Full Name', type: 'string', required: true },
        { key: 'email', label: 'Email', type: 'string', required: true },
        { key: 'role', label: 'Role', type: 'string', required: true },
        { key: 'status', label: 'Status', type: 'string', required: true },
      ],
    },
    {
      key: 'roles',
      label: 'Roles',
      order: 50,
      fields: [
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'label', label: 'Label', type: 'string', required: true },
        { key: 'status', label: 'Status', type: 'string', required: true },
      ],
    },
    {
      key: 'settings',
      label: 'Settings',
      order: 60,
      fields: [{ key: 'payload', label: 'Settings JSON', type: 'string', required: true }],
    },
    {
      key: 'admin_accounts',
      label: 'Admin Accounts',
      order: 70,
      fields: [
        { key: 'email', label: 'Email', type: 'string', required: true },
        { key: 'role', label: 'Role', type: 'string', required: true },
      ],
    },
  ],
} as const;
