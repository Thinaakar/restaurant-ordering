import { seedDatabaseIfEmpty } from '@/lib/firestore/seed';
import { ensureDb, handleRouteError, jsonData } from '@/lib/api/route-helpers';

export async function POST() {
  try {
    await ensureDb();
    const result = await seedDatabaseIfEmpty();
    return jsonData(result);
  } catch (e) {
    return handleRouteError(e);
  }
}
