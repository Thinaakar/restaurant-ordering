import { listRoles } from "@/lib/firestore/app-data";
import { createRole } from "@/lib/firestore/app-writes";
import { roleCreateSchema } from "@/lib/validation/entities";
import { demoRoles } from "@/lib/demo";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireAuth,
  requireNonDemoSuperAdmin,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    requireAuth(request);
    if (isDemoRequest(request)) return jsonData(demoRoles);
    await ensureDb();
    return jsonData(await listRoles());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    requireNonDemoSuperAdmin(request);
    await ensureDb();
    const body = roleCreateSchema.parse(await request.json());
    const name = body.label.toLowerCase().replace(/\s+/g, "_");
    return jsonData(await createRole({ ...body, name }), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
