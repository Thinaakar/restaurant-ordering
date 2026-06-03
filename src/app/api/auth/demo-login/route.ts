import { loginSchema } from "@/lib/validation/entities";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth/session";
import {
  demoSuperAdminAccount,
  verifyDemoCredentials,
} from "@/lib/demo/account";
import { handleRouteError, jsonData } from "@/lib/api/route-helpers";
import { apiError } from "@/lib/http/api-error";

/** Demo Super Admin — full UI access, read-only sample data from lib/demo. */
export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    if (!verifyDemoCredentials(body.email, body.password)) {
      return apiError("Invalid demo credentials", 401);
    }
    const token = createSessionToken({
      email: demoSuperAdminAccount.email,
      name: demoSuperAdminAccount.name,
      role: demoSuperAdminAccount.role,
      avatar: demoSuperAdminAccount.avatar,
      isDemo: true,
    });
    const res = jsonData({
      email: demoSuperAdminAccount.email,
      name: demoSuperAdminAccount.name,
      role: demoSuperAdminAccount.role,
      avatar: demoSuperAdminAccount.avatar,
      isDemo: true,
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (e) {
    return handleRouteError(e);
  }
}
