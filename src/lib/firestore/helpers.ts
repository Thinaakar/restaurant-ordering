import { Timestamp } from 'firebase-admin/firestore';

export function toIsoString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as Timestamp).toDate === 'function'
  ) {
    return (value as Timestamp).toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

export function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj } as T;
  for (const key of Object.keys(out)) {
    const k = key as keyof T;
    if (out[k] === undefined) delete out[k];
  }
  return out;
}
