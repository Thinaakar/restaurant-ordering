import { getMenuItem } from "@/lib/firestore/app-data";
import { updateMenuItem, deleteMenuItem } from "@/lib/firestore/app-writes";
import { menuItemUpdateSchema } from "@/lib/validation/entities";
import { getDemoMenuItemById } from "@/lib/demo";
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
      const item = getDemoMenuItemById(id);
      if (!item) return apiError("Menu item not found", 404);
      return jsonData(item);
    }
    await ensureDb();
    const item = await getMenuItem(id);
    if (!item) return apiError("Menu item not found", 404);
    return jsonData(item);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    requireNonDemoAuth(request);
    await ensureDb();
    const { id } = await params;
    const body = menuItemUpdateSchema.parse(await request.json());
    const item = await updateMenuItem(id, body);
    if (!item) return apiError("Menu item not found", 404);
    return jsonData(item);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    requireNonDemoAuth(request);
    await ensureDb();
    const { id } = await params;
    await deleteMenuItem(id);
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
