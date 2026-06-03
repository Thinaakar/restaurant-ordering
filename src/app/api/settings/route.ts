import { getSettings } from "@/lib/firestore/app-data";
import { updateSettings } from "@/lib/firestore/app-writes";
import { settingsUpdateSchema } from "@/lib/validation/entities";
import { demoSettings } from "@/lib/demo";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireAuth,
  requireNonDemoAuth,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    requireAuth(request);
    if (isDemoRequest(request)) return jsonData(demoSettings);
    await ensureDb();
    return jsonData((await getSettings()) ?? {});
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request) {
  try {
    requireNonDemoAuth(request);
    await ensureDb();
    const body = settingsUpdateSchema.parse(await request.json());
    return jsonData(await updateSettings(body));
  } catch (e) {
    return handleRouteError(e);
  }
}
