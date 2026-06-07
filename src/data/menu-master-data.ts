export type MasterDataStatus = "active" | "inactive";

export interface DishTypeMaster {
  id: string;
  label: string;
  value: string;
  isVeg: boolean;
  status: MasterDataStatus;
  isSystem?: boolean;
}

export interface SpiceLevelMaster {
  id: string;
  label: string;
  value: string;
  status: MasterDataStatus;
  isSystem?: boolean;
}

export const DEFAULT_DISH_TYPES: DishTypeMaster[] = [
  {
    id: "dish_veg",
    label: "Veg",
    value: "veg",
    isVeg: true,
    status: "active",
    isSystem: true,
  },
  {
    id: "dish_non_veg",
    label: "Non-veg",
    value: "non-veg",
    isVeg: false,
    status: "active",
    isSystem: true,
  },
];

export const DEFAULT_SPICE_LEVELS: SpiceLevelMaster[] = [
  { id: "spice_mild", label: "Mild", value: "mild", status: "active", isSystem: true },
  { id: "spice_medium", label: "Medium", value: "medium", status: "active", isSystem: true },
  { id: "spice_hot", label: "Hot", value: "hot", status: "active", isSystem: true },
  {
    id: "spice_extra_hot",
    label: "Extra-hot",
    value: "extra-hot",
    status: "active",
    isSystem: true,
  },
];

export function slugFromLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function newMasterDataId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
