import { seedDatabaseIfEmpty } from "@/lib/firestore/seed";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireNonDemoSuperAdmin,
} from "@/lib/api/route-helpers";

/** Loads sample tables, menu, orders, users, and roles (only when collections are empty). */
export async function POST(request: Request) {
  try {
    requireNonDemoSuperAdmin(request);
    await ensureDb();
    const result = await seedDatabaseIfEmpty();
    return jsonData(result);
  } catch (e) {
    return handleRouteError(e);
  }
}
