import { seedDatabaseIfEmpty } from "@/lib/firestore/seed";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireSuperAdmin,
} from "@/lib/api/route-helpers";

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    const result = await seedDatabaseIfEmpty();
    return jsonData(result);
  } catch (e) {
    return handleRouteError(e);
  }
}
