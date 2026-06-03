import { getSettings } from "@/lib/firestore/app-data";
import { updateSettings } from "@/lib/firestore/app-writes";
import type { DemoTableKey } from "./hidden-samples";

export const DEMO_CREATED_KEY = "demoCreatedRecordIds";

export async function getDemoCreatedIds(
  tableKey: DemoTableKey,
): Promise<Set<string>> {
  const settings = await getSettings();
  const raw = settings?.[DEMO_CREATED_KEY];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return new Set();
  const list = (raw as Record<string, string[]>)[tableKey];
  return new Set(list ?? []);
}

export async function trackDemoCreated(
  tableKey: DemoTableKey,
  id: string,
): Promise<void> {
  const settings = (await getSettings()) ?? {};
  const created = {
    ...((settings[DEMO_CREATED_KEY] as Record<string, string[]>) ?? {}),
  };
  const list = new Set(created[tableKey] ?? []);
  list.add(id);
  created[tableKey] = [...list];
  await updateSettings({ ...settings, [DEMO_CREATED_KEY]: created });
}

export async function clearDemoCreatedIds(): Promise<void> {
  const settings = (await getSettings()) ?? {};
  if (!(DEMO_CREATED_KEY in settings)) return;
  const next = { ...settings };
  delete next[DEMO_CREATED_KEY];
  await updateSettings(next);
}
