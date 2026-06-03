import { listManagedUsers } from "@/lib/firestore/app-data";
import { createManagedUser } from "@/lib/firestore/app-writes";
import { managedUserCreateSchema } from "@/lib/validation/entities";
import { demoManagedUsers } from "@/lib/demo";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireAuth,
  requireNonDemoAuth,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    requireAuth(request);
    if (isDemoRequest(request)) return jsonData(demoManagedUsers);
    await ensureDb();
    return jsonData(await listManagedUsers());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    requireNonDemoAuth(request);
    await ensureDb();
    const body = managedUserCreateSchema.parse(await request.json());
    return jsonData(await createManagedUser(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
