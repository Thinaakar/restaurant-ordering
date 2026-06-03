import { getManagedUser } from '@/lib/firestore/app-data';
import { updateManagedUser, deleteManagedUser } from '@/lib/firestore/app-writes';
import { managedUserUpdateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    const user = await getManagedUser(id);
    if (!user) return apiError('User not found', 404);
    return jsonData(user);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    const body = managedUserUpdateSchema.parse(await request.json());
    const user = await updateManagedUser(id, body);
    if (!user) return apiError('User not found', 404);
    return jsonData(user);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    await deleteManagedUser(id);
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
