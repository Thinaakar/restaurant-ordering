import {
  createDishType,
  listDishTypes,
} from "@/lib/master-data/service";
import { dishTypeCreateSchema } from "@/lib/validation/entities";
import {
  ensureDb,
  handleRouteError,
  jsonData,
  requireAuth,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    return jsonData(await listDishTypes());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = dishTypeCreateSchema.parse(await request.json());
    return jsonData(await createDishType(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
