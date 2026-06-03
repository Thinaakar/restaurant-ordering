import { FieldValue } from "firebase-admin/firestore";
import { seedDocument } from "@/lib/firestore/app-writes";
import { isDemoSampleId } from "./read-model";

export async function seedDemoSampleOverride(
  tableKey: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!isDemoSampleId(id)) return;
  await seedDocument(tableKey, id, {
    ...data,
    createdAt: data.createdAt ?? FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}
