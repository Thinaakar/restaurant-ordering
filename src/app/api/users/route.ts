import { createManagedUser } from "@/lib/firestore/app-writes";
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
    const created = await createManagedUser(body);
    if (isDemoRequest(request)) {
      await trackDemoCreated("managed_users", created.id);
    }
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
