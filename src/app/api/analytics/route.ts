import { getAnalyticsForRequest } from "@/lib/demo/request-data";
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
    return jsonData(await getAnalyticsForRequest(request));
  } catch (e) {
    return handleRouteError(e);
  }
}
