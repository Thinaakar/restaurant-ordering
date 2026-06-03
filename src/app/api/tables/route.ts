import { listTables } from "@/lib/firestore/app-data";
import { createTable } from "@/lib/firestore/app-writes";
import { tableCreateSchema } from "@/lib/validation/entities";
import { demoTables } from "@/lib/demo";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
  requireNonDemoAuth,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    if (isDemoRequest(request)) return jsonData(demoTables);
    await ensureDb();
    return jsonData(await listTables());
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    requireNonDemoAuth(request);
    await ensureDb();
    const body = tableCreateSchema.parse(await request.json());
    return jsonData(await createTable(body), 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
