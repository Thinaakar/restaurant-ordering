import { listManagedUsers } from '@/lib/firestore/app-data';
import { createManagedUser } from '@/lib/firestore/app-writes';
import { managedUserCreateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';

export async function GET(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    return jsonData(await listManagedUsers());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = managedUserCreateSchema.parse(await request.json());
    return jsonData(await createManagedUser(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
