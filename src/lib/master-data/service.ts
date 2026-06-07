import { getSettings } from "@/lib/firestore/app-data";
import { updateSettings } from "@/lib/firestore/app-writes";
import {
  DEFAULT_DISH_TYPES,
  DEFAULT_SPICE_LEVELS,
  newMasterDataId,
  slugFromLabel,
  type DishTypeMaster,
  type SpiceLevelMaster,
} from "@/data/menu-master-data";

const DISH_TYPES_KEY = "dishTypes";
const SPICE_LEVELS_KEY = "spiceLevels";

function parseList<T>(raw: unknown, fallback: T[]): T[] {
  if (!Array.isArray(raw) || raw.length === 0) return [...fallback];
  return raw as T[];
}

async function readPayload(): Promise<Record<string, unknown>> {
  return (await getSettings()) ?? {};
}

async function writePayload(payload: Record<string, unknown>) {
  return updateSettings(payload);
}

export async function listDishTypes(): Promise<DishTypeMaster[]> {
  const payload = await readPayload();
  return parseList(payload[DISH_TYPES_KEY], DEFAULT_DISH_TYPES);
}

export async function listSpiceLevels(): Promise<SpiceLevelMaster[]> {
  const payload = await readPayload();
  return parseList(payload[SPICE_LEVELS_KEY], DEFAULT_SPICE_LEVELS);
}

export async function createDishType(input: {
  label: string;
  isVeg: boolean;
  status?: DishTypeMaster["status"];
}): Promise<DishTypeMaster> {
  const payload = await readPayload();
  const items = parseList<DishTypeMaster>(payload[DISH_TYPES_KEY], DEFAULT_DISH_TYPES);
  const value = slugFromLabel(input.label);
  if (items.some((i) => i.value === value)) {
    throw new Error("A dish type with this name already exists.");
  }
  const created: DishTypeMaster = {
    id: newMasterDataId("dish"),
    label: input.label.trim(),
    value,
    isVeg: input.isVeg,
    status: input.status ?? "active",
  };
  await writePayload({ ...payload, [DISH_TYPES_KEY]: [...items, created] });
  return created;
}

export async function updateDishType(
  id: string,
  patch: Partial<Pick<DishTypeMaster, "label" | "isVeg" | "status">>,
): Promise<DishTypeMaster | null> {
  const payload = await readPayload();
  const items = parseList<DishTypeMaster>(payload[DISH_TYPES_KEY], DEFAULT_DISH_TYPES);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const current = items[index];
  const nextLabel = patch.label?.trim() ?? current.label;
  const nextValue = current.isSystem ? current.value : slugFromLabel(nextLabel);

  if (
    !current.isSystem &&
    nextValue !== current.value &&
    items.some((i) => i.id !== id && i.value === nextValue)
  ) {
    throw new Error("A dish type with this name already exists.");
  }

  const updated: DishTypeMaster = {
    ...current,
    ...patch,
    label: nextLabel,
    value: nextValue,
  };
  items[index] = updated;
  await writePayload({ ...payload, [DISH_TYPES_KEY]: items });
  return updated;
}

export async function deleteDishType(id: string): Promise<boolean> {
  const payload = await readPayload();
  const items = parseList<DishTypeMaster>(payload[DISH_TYPES_KEY], DEFAULT_DISH_TYPES);
  const target = items.find((i) => i.id === id);
  if (!target) return false;
  if (target.isSystem) return false;
  await writePayload({
    ...payload,
    [DISH_TYPES_KEY]: items.filter((i) => i.id !== id),
  });
  return true;
}

export async function createSpiceLevel(input: {
  label: string;
  status?: SpiceLevelMaster["status"];
}): Promise<SpiceLevelMaster> {
  const payload = await readPayload();
  const items = parseList<SpiceLevelMaster>(payload[SPICE_LEVELS_KEY], DEFAULT_SPICE_LEVELS);
  const value = slugFromLabel(input.label);
  if (items.some((i) => i.value === value)) {
    throw new Error("A spice level with this name already exists.");
  }
  const created: SpiceLevelMaster = {
    id: newMasterDataId("spice"),
    label: input.label.trim(),
    value,
    status: input.status ?? "active",
  };
  await writePayload({ ...payload, [SPICE_LEVELS_KEY]: [...items, created] });
  return created;
}

export async function updateSpiceLevel(
  id: string,
  patch: Partial<Pick<SpiceLevelMaster, "label" | "status">>,
): Promise<SpiceLevelMaster | null> {
  const payload = await readPayload();
  const items = parseList<SpiceLevelMaster>(payload[SPICE_LEVELS_KEY], DEFAULT_SPICE_LEVELS);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const current = items[index];
  const nextLabel = patch.label?.trim() ?? current.label;
  const nextValue = current.isSystem ? current.value : slugFromLabel(nextLabel);

  if (
    !current.isSystem &&
    nextValue !== current.value &&
    items.some((i) => i.id !== id && i.value === nextValue)
  ) {
    throw new Error("A spice level with this name already exists.");
  }

  const updated: SpiceLevelMaster = {
    ...current,
    ...patch,
    label: nextLabel,
    value: nextValue,
  };
  items[index] = updated;
  await writePayload({ ...payload, [SPICE_LEVELS_KEY]: items });
  return updated;
}

export async function deleteSpiceLevel(id: string): Promise<boolean> {
  const payload = await readPayload();
  const items = parseList<SpiceLevelMaster>(payload[SPICE_LEVELS_KEY], DEFAULT_SPICE_LEVELS);
  const target = items.find((i) => i.id === id);
  if (!target) return false;
  if (target.isSystem) return false;
  await writePayload({
    ...payload,
    [SPICE_LEVELS_KEY]: items.filter((i) => i.id !== id),
  });
  return true;
}
