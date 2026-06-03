import { getSettings } from "@/lib/firestore/app-data";
import { updateSettings } from "@/lib/firestore/app-writes";

export const DEMO_HIDDEN_KEY = "demoHiddenSampleIds";

export type DemoTableKey =
  | "tables"
  | "menu_items"
  | "orders"
  | "managed_users"
  | "roles";

export async function getDemoHiddenSampleIds(): Promise<
  Record<string, string[]>
> {
  const settings = await getSettings();
  const raw = settings?.[DEMO_HIDDEN_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as Record<string, string[]>;
}

export async function getHiddenSetForTable(
  tableKey: DemoTableKey,
): Promise<Set<string>> {
  const all = await getDemoHiddenSampleIds();
  return new Set(all[tableKey] ?? []);
}

export async function hideDemoSample(
  tableKey: DemoTableKey,
  id: string,
): Promise<void> {
  const settings = (await getSettings()) ?? {};
  const hidden = {
    ...((settings[DEMO_HIDDEN_KEY] as Record<string, string[]>) ?? {}),
  };
  const list = new Set(hidden[tableKey] ?? []);
  list.add(id);
  hidden[tableKey] = [...list];
  await updateSettings({ ...settings, [DEMO_HIDDEN_KEY]: hidden });
}

export async function clearDemoHiddenSampleIds(): Promise<void> {
  const settings = (await getSettings()) ?? {};
  const next = { ...settings };
  delete next[DEMO_HIDDEN_KEY];
  delete next["demoCreatedRecordIds"];
  await updateSettings(next);
}
