import { updateSettings } from "@/lib/firestore/app-writes";
import { settingsUpdateSchema } from "@/lib/validation/entities";
import { getSettingsForRequest } from "@/lib/demo/request-data";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireAuth,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    return jsonData(await getSettingsForRequest(request));
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = settingsUpdateSchema.parse(await request.json());
    return jsonData(await updateSettings(body));
  } catch (e) {
    return handleRouteError(e);
  }
}
