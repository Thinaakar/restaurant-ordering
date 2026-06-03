import { hideDemoSample, type DemoTableKey } from "./hidden-samples";
import { isDemoSampleId } from "./read-model";

export async function deleteRecordOrHideDemoSample(
  tableKey: DemoTableKey,
  id: string,
  deleteFn: () => Promise<void>,
): Promise<void> {
  try {
    await deleteFn();
  } catch {
    /* doc may not exist */
  }
  if (isDemoSampleId(id)) {
    await hideDemoSample(tableKey, id);
  }
}
