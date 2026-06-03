import { createRole } from "@/lib/firestore/app-writes";
import { roleCreateSchema } from "@/lib/validation/entities";
import { listRolesForRequest } from "@/lib/demo/request-data";
import { trackDemoCreated } from "@/lib/demo/created-records";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireAuth,
  requireSuperAdmin,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    return jsonData(await listRolesForRequest(request));
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    const body = roleCreateSchema.parse(await request.json());
    const name = body.label.toLowerCase().replace(/\s+/g, "_");
    const created = await createRole({ ...body, name });
    if (isDemoRequest(request)) await trackDemoCreated("roles", created.id);
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
