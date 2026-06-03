import { getRole } from "@/lib/firestore/app-data";
import { updateRolePermissions } from "@/lib/firestore/app-writes";
import { rolePermissionsSchema } from "@/lib/validation/entities";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireNonDemoSuperAdmin,
} from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    requireNonDemoSuperAdmin(request);
    await ensureDb();
    const { id } = await params;
    const role = await getRole(id);
    if (!role) return apiError("Role not found", 404);
    if (role.name === "super_admin") {
      return apiError("Super Admin permissions cannot be modified", 400);
    }
    const body = rolePermissionsSchema.parse(await request.json());
    const updated = await updateRolePermissions(id, body.permissions);
    return jsonData(updated);
  } catch (e) {
    return handleRouteError(e);
  }
}
