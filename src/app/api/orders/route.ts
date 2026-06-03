import { createOrder } from "@/lib/firestore/app-writes";
import { orderCreateSchema } from "@/lib/validation/entities";
import { listOrdersForRequest } from "@/lib/demo/request-data";
import { trackDemoCreated } from "@/lib/demo/created-records";
import {
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
} from "@/lib/api/route-helpers";

export async function GET(request: Request) {
  try {
    await ensureDb();
    return jsonData(await listOrdersForRequest(request));
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDb();
    const body = orderCreateSchema.parse(await request.json());
    const created = await createOrder(body);
    if (isDemoRequest(request)) await trackDemoCreated("orders", created.id);
    return jsonData(created, 201);
  } catch (e) {
    return handleRouteError(e);
  }
}
