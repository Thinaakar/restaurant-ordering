import { updateOrder, deleteOrder } from "@/lib/firestore/app-writes";
import { orderUpdateSchema } from "@/lib/validation/entities";
import { getOrderForRequest } from "@/lib/demo/request-data";
import { getDemoOrderById, isDemoSampleId } from "@/lib/demo/read-model";
import { seedDemoSampleOverride } from "@/lib/demo/sample-overrides";
import { deleteRecordOrHideDemoSample } from "@/lib/demo/delete-sample";
import { ensureDb, handleRouteError, jsonData } from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    await ensureDb();
    const { id } = await params;
    const order = await getOrderForRequest(request, id);
    if (!order) return apiError("Order not found", 404);
    return jsonData(order);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await ensureDb();
    const { id } = await params;
    const body = orderUpdateSchema.parse(await request.json());
    let order = await updateOrder(id, body);
    if (!order && isDemoSampleId(id)) {
      const sample = getDemoOrderById(id);
      if (!sample) return apiError("Order not found", 404);
      await seedDemoSampleOverride("orders", id, { ...sample, ...body });
      order = { ...sample, ...body };
    }
    if (!order) return apiError("Order not found", 404);
    return jsonData(order);
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await ensureDb();
    const { id } = await params;
    await deleteRecordOrHideDemoSample("orders", id, async () => {
      await deleteOrder(id);
    });
    return jsonData({ ok: true });
  } catch (e) {
    return handleRouteError(e);
  }
}
