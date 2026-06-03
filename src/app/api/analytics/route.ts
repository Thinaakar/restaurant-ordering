import { getAnalyticsSummary } from "@/lib/firestore/app-data";
import { getDemoAnalyticsSummary } from "@/lib/demo";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireAuth,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    requireAuth(request);
    if (isDemoRequest(request)) return jsonData(getDemoAnalyticsSummary());
    await ensureDb();
    return jsonData(await getAnalyticsSummary());
  } catch (e) {
    return handleRouteError(e);
  }
}
