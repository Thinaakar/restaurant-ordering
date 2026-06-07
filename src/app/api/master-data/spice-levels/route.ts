import {
  createSpiceLevel,
  listSpiceLevels,
} from "@/lib/master-data/service";
import { spiceLevelCreateSchema } from "@/lib/validation/entities";
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
    return jsonData(await listSpiceLevels());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    requireAuth(request);
    const body = spiceLevelCreateSchema.parse(await request.json());
    return jsonData(await createSpiceLevel(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
