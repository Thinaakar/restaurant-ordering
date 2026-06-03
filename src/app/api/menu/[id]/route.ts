import { updateMenuItem, deleteMenuItem } from "@/lib/firestore/app-writes";
import { menuItemUpdateSchema } from "@/lib/validation/entities";
import { getMenuItemForRequest } from "@/lib/demo/request-data";
import { getDemoMenuItemById, isDemoSampleId } from "@/lib/demo/read-model";
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
    const item = await getMenuItemForRequest(request, id);
    if (!item) return apiError("Menu item not found", 404);
    return jsonData(item);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    const body = menuItemUpdateSchema.parse(await request.json());
    let item = await updateMenuItem(id, body);
    if (!item && isDemoSampleId(id)) {
      const sample = getDemoMenuItemById(id);
      if (!sample) return apiError("Menu item not found", 404);
      const merged = { ...sample, ...body };
      await seedDemoSampleOverride("menu_items", id, merged);
      item = merged;
    }
    if (!item) return apiError("Menu item not found", 404);
    return jsonData(item);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    await deleteRecordOrHideDemoSample("menu_items", id, async () => {
      await deleteMenuItem(id);
    });
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
