import { PERMISSION_MODULES } from '@/data/permission-modules';
import { ensureDb, handleRouteError, jsonData, requireSuperAdmin } from '@/lib/api/route-helpers';

export async function GET(request: Request) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    return jsonData(PERMISSION_MODULES);
  } catch (e) {
    return handleRouteError(e);
  }
}
