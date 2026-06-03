import {
  updateManagedUser,
  deleteManagedUser,
} from "@/lib/firestore/app-writes";
import { managedUserUpdateSchema } from "@/lib/validation/entities";
import { getManagedUserForRequest } from "@/lib/demo/request-data";
import { getDemoManagedUserById, isDemoSampleId } from "@/lib/demo/read-model";
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
    requireAuth(request);
    const { id } = await params;
    const user = await getManagedUserForRequest(request, id);
    if (!user) return apiError("User not found", 404);
    return jsonData(user);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    const body = managedUserUpdateSchema.parse(await request.json());
    let user = await updateManagedUser(id, body);
    if (!user && isDemoSampleId(id)) {
      const sample = getDemoManagedUserById(id);
      if (!sample) return apiError("User not found", 404);
      const merged = { ...sample, ...body };
      await seedDemoSampleOverride("managed_users", id, merged);
      user = merged;
    }
    if (!user) return apiError("User not found", 404);
    return jsonData(user);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    await deleteRecordOrHideDemoSample("managed_users", id, async () => {
      await deleteManagedUser(id);
    });
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
