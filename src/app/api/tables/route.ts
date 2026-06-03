import { createTable } from "@/lib/firestore/app-writes";
import { tableCreateSchema } from "@/lib/validation/entities";
import { listTablesForRequest } from "@/lib/demo/request-data";
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
    return jsonData(await listTablesForRequest(request));
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = tableCreateSchema.parse(await request.json());
    const created = await createTable(body);
    if (isDemoRequest(request)) await trackDemoCreated("tables", created.id);
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
