import { listTables } from '@/lib/firestore/app-data';
import { createTable } from '@/lib/firestore/app-writes';
import { tableCreateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';

export async function GET() {
  try {
    await ensureDb();
    return jsonData(await listTables());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = tableCreateSchema.parse(await request.json());
    return jsonData(await createTable(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
