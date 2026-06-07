import {
  deleteDishType,
  updateDishType,
} from "@/lib/master-data/service";
import { dishTypeUpdateSchema } from "@/lib/validation/entities";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireAuth,
} from "@/lib/api/route-helpers";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    const body = dishTypeUpdateSchema.parse(await request.json());
    const updated = await updateDishType(id, body);
    if (!updated) return handleRouteError(new Error("Dish type not found"));
    return jsonData(updated);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    const ok = await deleteDishType(id);
    if (!ok) {
      return handleRouteError(
        new Error("Cannot delete: dish type not found or is system-defined."),
      );
    }
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
