import { getMenuItem } from '@/lib/firestore/app-data';
import { updateMenuItem, deleteMenuItem } from '@/lib/firestore/app-writes';
import { menuItemUpdateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await ensureDb();
    const { id } = await params;
    const item = await getMenuItem(id);
    if (!item) return apiError('Menu item not found', 404);
    return jsonData(item);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    const body = menuItemUpdateSchema.parse(await request.json());
    const item = await updateMenuItem(id, body);
    if (!item) return apiError('Menu item not found', 404);
    return jsonData(item);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await ensureDb();
    requireAuth(request);
    const { id } = await params;
    await deleteMenuItem(id);
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
