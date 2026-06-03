import { getOrder } from "@/lib/firestore/app-data";
import { updateOrder, deleteOrder } from "@/lib/firestore/app-writes";
import { orderUpdateSchema } from "@/lib/validation/entities";
import { getDemoOrderById } from "@/lib/demo";
import {
  blockDemoWrites,
  ensureDb,
  handleRouteError,
  isDemoRequest,
  jsonData,
} from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    if (isDemoRequest(request)) {
      const order = getDemoOrderById(id);
      if (!order) return apiError("Order not found", 404);
      return jsonData(order);
    }
    await ensureDb();
    const order = await getOrder(id);
    if (!order) return apiError("Order not found", 404);
    return jsonData(order);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    blockDemoWrites(request);
    await ensureDb();
    const { id } = await params;
    const body = orderUpdateSchema.parse(await request.json());
    const order = await updateOrder(id, body);
    if (!order) return apiError("Order not found", 404);
    return jsonData(order);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    blockDemoWrites(request);
    await ensureDb();
    const { id } = await params;
    await deleteOrder(id);
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
