import {
  updateManagedUser,
  deleteManagedUser,
} from "@/lib/firestore/app-writes";
import { getManagedUser } from "@/lib/firestore/app-data";
import {
  removeAuthAccountForEmail,
  syncAuthAccountForManagedUser,
} from "@/lib/auth/account-sync";
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
    const previous = await getManagedUser(id);

    let user = await updateManagedUser(id, body);
    if (!user && isDemoSampleId(id)) {
      const sample = getDemoManagedUserById(id);
      if (!sample) return apiError("User not found", 404);
      const merged = { ...sample, ...body };
      await seedDemoSampleOverride("managed_users", id, merged);
      user = merged;
    }
    if (!user) return apiError("User not found", 404);

    if (!isDemoSampleId(id)) {
      await syncAuthAccountForManagedUser(
        {
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          status: user.status,
        },
        { previousEmail: previous?.email },
      );
    }

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
    const existing = await getManagedUser(id);

    await deleteRecordOrHideDemoSample("managed_users", id, async () => {
      if (existing) await removeAuthAccountForEmail(existing.email);
      await deleteManagedUser(id);
    });
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
