import { listRoles } from '@/lib/firestore/app-data';
import { createRole } from '@/lib/firestore/app-writes';
import { roleCreateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireSuperAdmin } from '@/lib/api/route-helpers';

export async function GET(request: Request) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    return jsonData(await listRoles());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireSuperAdmin(request);
    const body = roleCreateSchema.parse(await request.json());
    const name = body.label.toLowerCase().replace(/\s+/g, '_');
    return jsonData(await createRole({ ...body, name }), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
