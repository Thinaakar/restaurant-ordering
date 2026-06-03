import { clearOperationalData } from "@/lib/firestore/app-writes";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireNonDemoSuperAdmin,
} from "@/lib/api/route-helpers";

/** Clears orders, tables, menu, users, and roles so dashboard/reports show zero. */
export async function POST(request: Request) {
  try {
    requireNonDemoSuperAdmin(request);
    await ensureDb();
    const deleted = await clearOperationalData();
    return jsonData({ cleared: true, deleted });
  } catch (e) {
    return handleRouteError(e);
  }
}
