import { listMenuItems } from "@/lib/firestore/app-data";
import { createMenuItem } from "@/lib/firestore/app-writes";
import { menuItemCreateSchema } from "@/lib/validation/entities";
import { demoMenuItems } from "@/lib/demo";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireNonDemoAuth,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    if (isDemoRequest(request)) return jsonData(demoMenuItems);
    await ensureDb();
    return jsonData(await listMenuItems());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    requireNonDemoAuth(request);
    await ensureDb();
    const body = menuItemCreateSchema.parse(await request.json());
    return jsonData(await createMenuItem(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
