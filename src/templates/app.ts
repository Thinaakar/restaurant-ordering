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

/** Rename `app` key/label for your product. Add tables as you build features. */
export const appTemplate = {
  key: 'app',
  label: 'App',
  tables: [
    {
      key: 'users',
      label: 'Users',
      order: 10,
      fields: [
        { key: 'displayName', label: 'Name', type: 'string', required: true },
        { key: 'email', label: 'Email', type: 'string', required: true },
        { key: 'createdAt', label: 'Created', type: 'timestamp', required: true },
        { key: 'updatedAt', label: 'Updated', type: 'timestamp', required: true },
      ],
    },
  ],
} as const;
