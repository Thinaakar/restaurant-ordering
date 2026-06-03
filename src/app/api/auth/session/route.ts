import { getSessionFromRequest } from '@/lib/auth/session';
import { handleRouteError, jsonData } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) return apiError('Unauthorized', 401);
    const { exp: _exp, ...user } = session;
    return jsonData(user);
  } catch (e) {
    return handleRouteError(e);
  }
}
