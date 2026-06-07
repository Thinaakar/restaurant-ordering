import { createManagedUser } from "@/lib/firestore/app-writes";
import { getManagedUserByEmail } from "@/lib/firestore/app-data";
import { syncAuthAccountForManagedUser } from "@/lib/auth/account-sync";
import { managedUserCreateSchema } from "@/lib/validation/entities";
import { listManagedUsersForRequest } from "@/lib/demo/request-data";
import { trackDemoCreated } from "@/lib/demo/created-records";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireAuth,
} from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

export async function GET(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    return jsonData(await listManagedUsersForRequest(request));
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = managedUserCreateSchema.parse(await request.json());
    const { password, ...profile } = body;

    const existing = await getManagedUserByEmail(profile.email);
    if (existing) {
      return apiError("A user with this email already exists", 409);
    }

    const created = await createManagedUser(profile);
    await syncAuthAccountForManagedUser(
      {
        email: created.email,
        fullName: created.fullName,
        role: created.role,
        status: created.status,
      },
      { password },
    );

    if (isDemoRequest(request)) {
      await trackDemoCreated("managed_users", created.id);
    }
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
