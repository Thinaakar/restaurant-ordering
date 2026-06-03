import { countUsersByRole } from "@/lib/firestore/app-data";
import { updateRole, deleteRole } from "@/lib/firestore/app-writes";
import { roleUpdateSchema } from "@/lib/validation/entities";
import { getRoleForRequest } from "@/lib/demo/request-data";
import { getDemoRoleById, isDemoSampleId } from "@/lib/demo/read-model";
import { seedDemoSampleOverride } from "@/lib/demo/sample-overrides";
import { deleteRecordOrHideDemoSample } from "@/lib/demo/delete-sample";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireSuperAdmin,
} from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    const { id } = await params;
    const role = await getRoleForRequest(request, id);
    if (!role) return apiError("Role not found", 404);
    return jsonData(role);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    const { id } = await params;
    const body = roleUpdateSchema.parse(await request.json());
    let role = await updateRole(id, body);
    if (!role && isDemoSampleId(id)) {
      const sample = getDemoRoleById(id);
      if (!sample) return apiError("Role not found", 404);
      const merged = { ...sample, ...body, id };
      await seedDemoSampleOverride("roles", id, merged);
      role = merged;
    }
    if (!role) return apiError("Role not found", 404);
    return jsonData(role);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    const { id } = await params;
    const role = await getRoleForRequest(request, id);
    if (!role) return apiError("Role not found", 404);
    const count = await countUsersByRole(role.name);
    if (count > 0)
      return apiError("Cannot delete role with assigned users", 400);
    await deleteRecordOrHideDemoSample("roles", id, async () => {
      await deleteRole(id);
    });
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
