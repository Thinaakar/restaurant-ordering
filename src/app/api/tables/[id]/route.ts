import { getTable } from "@/lib/firestore/app-data";
import { updateTable, deleteTable } from "@/lib/firestore/app-writes";
import { tableUpdateSchema } from "@/lib/validation/entities";
import { getDemoTableById } from "@/lib/demo";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireNonDemoAuth,
} from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    if (isDemoRequest(request)) {
      const table = getDemoTableById(id);
      if (!table) return apiError("Table not found", 404);
      return jsonData(table);
    }
    await ensureDb();
    const table = await getTable(id);
    if (!table) return apiError("Table not found", 404);
    return jsonData(table);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    requireNonDemoAuth(request);
    await ensureDb();
    const { id } = await params;
    const body = tableUpdateSchema.parse(await request.json());
    const { currentOrderId, ...rest } = body;
    const patch: Partial<import("@/data/types").RestaurantTable> = { ...rest };
    if (currentOrderId === null) patch.currentOrderId = undefined;
    else if (currentOrderId !== undefined)
      patch.currentOrderId = currentOrderId;
    const table = await updateTable(id, patch);
    if (!table) return apiError("Table not found", 404);
    return jsonData(table);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    requireNonDemoAuth(request);
    await ensureDb();
    const { id } = await params;
    await deleteTable(id);
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
