import { getRole, countUsersByRole } from "@/lib/firestore/app-data";
import { updateRole, deleteRole } from "@/lib/firestore/app-writes";
import { roleUpdateSchema } from "@/lib/validation/entities";
import { demoRoles } from "@/lib/demo";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireSuperAdmin,
  requireNonDemoSuperAdmin,
} from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    requireSuperAdmin(request);
    const { id } = await params;
    if (isDemoRequest(request)) {
      const role = demoRoles.find((r) => r.id === id);
      if (!role) return apiError("Role not found", 404);
      return jsonData(role);
    }
    await ensureDb();
    const role = await getRole(id);
    if (!role) return apiError("Role not found", 404);
    return jsonData(role);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    requireNonDemoSuperAdmin(request);
    await ensureDb();
    const { id } = await params;
    const body = roleUpdateSchema.parse(await request.json());
    const role = await updateRole(id, body);
    if (!role) return apiError("Role not found", 404);
    return jsonData(role);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    requireNonDemoSuperAdmin(request);
    await ensureDb();
    const { id } = await params;
    const role = await getRole(id);
    if (!role) return apiError("Role not found", 404);
    const count = await countUsersByRole(role.name);
    if (count > 0)
      return apiError("Cannot delete role with assigned users", 400);
    const ok = await deleteRole(id);
    if (!ok) return apiError("Cannot delete system role", 400);
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
