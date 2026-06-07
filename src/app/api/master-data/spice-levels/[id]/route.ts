import {
  deleteSpiceLevel,
  updateSpiceLevel,
} from "@/lib/master-data/service";
import { spiceLevelUpdateSchema } from "@/lib/validation/entities";
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
    const body = spiceLevelUpdateSchema.parse(await request.json());
    const updated = await updateSpiceLevel(id, body);
    if (!updated) return handleRouteError(new Error("Spice level not found"));
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
    const ok = await deleteSpiceLevel(id);
    if (!ok) {
      return handleRouteError(
        new Error("Cannot delete: spice level not found or is system-defined."),
      );
    }
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
