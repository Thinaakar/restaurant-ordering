import { listMenuItems } from '@/lib/firestore/app-data';
import { createMenuItem } from '@/lib/firestore/app-writes';
import { menuItemCreateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';

export async function GET() {
  try {
    await ensureDb();
    return jsonData(await listMenuItems());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = menuItemCreateSchema.parse(await request.json());
    return jsonData(await createMenuItem(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
