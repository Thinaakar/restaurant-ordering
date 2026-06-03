import { updateRolePermissions } from "@/lib/firestore/app-writes";
import { rolePermissionsSchema } from "@/lib/validation/entities";
import { getRoleForRequest } from "@/lib/demo/request-data";
import { getDemoRoleById, isDemoSampleId } from "@/lib/demo/read-model";
import { seedDemoSampleOverride } from "@/lib/demo/sample-overrides";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireSuperAdmin,
} from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    const { id } = await params;
    const role = await getRoleForRequest(request, id);
    if (!role) return apiError("Role not found", 404);
    if (role.name === "super_admin") {
      return apiError("Super Admin permissions cannot be modified", 400);
    }
    const body = rolePermissionsSchema.parse(await request.json());
    let updated = await updateRolePermissions(id, body.permissions);
    if (!updated && isDemoSampleId(id)) {
      const sample = getDemoRoleById(id);
      if (!sample) return apiError("Role not found", 404);
      const merged = { ...sample, permissions: body.permissions };
      await seedDemoSampleOverride("roles", id, merged);
      updated = merged;
    }
    if (!updated) return apiError("Role not found", 404);
    return jsonData(updated);
  } catch (e) {
    return handleRouteError(e);
  }
}
