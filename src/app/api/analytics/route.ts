import { getAnalyticsSummary } from '@/lib/firestore/app-data';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';

export async function GET(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    return jsonData(await getAnalyticsSummary());
  } catch (e) {
    return handleRouteError(e);
  }
}
