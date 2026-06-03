import { listOrders } from '@/lib/firestore/app-data';
import { createOrder } from '@/lib/firestore/app-writes';
import { orderCreateSchema } from '@/lib/validation/entities';
import { ensureDb, handleRouteError, jsonData, requireAuth } from '@/lib/api/route-helpers';

export async function GET() {
  try {
    await ensureDb();
    return jsonData(await listOrders());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    const body = orderCreateSchema.parse(await request.json());
    return jsonData(await createOrder(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
