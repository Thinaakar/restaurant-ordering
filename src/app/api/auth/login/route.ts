import { loginSchema } from '@/lib/validation/entities';
import { getAdminAccountByEmail } from '@/lib/firestore/app-data';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session';
import { ensureDemoAdminAccounts } from '@/lib/firestore/seed';
import { ensureDb, handleRouteError, jsonData } from '@/lib/api/route-helpers';
import { apiError } from '@/lib/http/api-error';

export async function POST(request: Request) {
  try {
    await ensureDb();
    await ensureDemoAdminAccounts();
    const body = loginSchema.parse(await request.json());
    const account = await getAdminAccountByEmail(body.email);
    if (!account || !verifyPassword(body.password, account.passwordHash)) {
      return apiError('Invalid credentials', 401);
    }
    const token = createSessionToken({
      email: account.email,
      name: account.name,
      role: account.role,
      avatar: account.avatar,
    });
    const res = jsonData({
      email: account.email,
      name: account.name,
      role: account.role,
      avatar: account.avatar,
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (e) {
    return handleRouteError(e);
  }
}
