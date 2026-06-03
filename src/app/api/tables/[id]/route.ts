import { updateTable, deleteTable } from "@/lib/firestore/app-writes";
import { tableUpdateSchema } from "@/lib/validation/entities";
import { getTableForRequest } from "@/lib/demo/request-data";
import { getDemoTableById, isDemoSampleId } from "@/lib/demo/read-model";
import { seedDemoSampleOverride } from "@/lib/demo/sample-overrides";
import { deleteRecordOrHideDemoSample } from "@/lib/demo/delete-sample";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireAuth,
} from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    await ensureDb();
    const { id } = await params;
    const table = await getTableForRequest(request, id);
    if (!table) return apiError("Table not found", 404);
    return jsonData(table);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    const body = tableUpdateSchema.parse(await request.json());
    const { currentOrderId, ...rest } = body;
    const patch: Partial<import("@/data/types").RestaurantTable> = { ...rest };
    if (currentOrderId === null) patch.currentOrderId = undefined;
    else if (currentOrderId !== undefined)
      patch.currentOrderId = currentOrderId;
    let table = await updateTable(id, patch);
    if (!table && isDemoSampleId(id)) {
      const sample = getDemoTableById(id);
      if (!sample) return apiError("Table not found", 404);
      const merged = { ...sample, ...patch };
      await seedDemoSampleOverride("tables", id, merged);
      table = merged;
    }
    if (!table) return apiError("Table not found", 404);
    return jsonData(table);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    await deleteRecordOrHideDemoSample("tables", id, async () => {
      await deleteTable(id);
    });
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
