import { createMenuItem } from "@/lib/firestore/app-writes";
import { menuItemCreateSchema } from "@/lib/validation/entities";
import { listMenuItemsForRequest } from "@/lib/demo/request-data";
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
    return jsonData(await listMenuItemsForRequest(request));
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = menuItemCreateSchema.parse(await request.json());
    const created = await createMenuItem(body);
    if (isDemoRequest(request)) await trackDemoCreated("menu_items", created.id);
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
