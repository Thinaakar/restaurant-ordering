import { getAdminAccountByEmail } from '@/lib/firestore/app-data';
import {
  deleteAdminAccountByEmail,
  upsertAdminAccount,
  upsertAdminAccountHash,
} from '@/lib/firestore/app-writes';
import type { ManagedUser } from '@/data/types';

export async function syncAuthAccountForManagedUser(
  user: Pick<ManagedUser, 'email' | 'fullName' | 'role' | 'status'>,
  options?: { password?: string; previousEmail?: string }
): Promise<void> {
  const email = user.email.toLowerCase();
  const previousEmail = options?.previousEmail?.toLowerCase();

  if (previousEmail && previousEmail !== email) {
    const existing = await getAdminAccountByEmail(previousEmail);
    if (existing && user.status === 'active') {
      if (options?.password) {
        await deleteAdminAccountByEmail(previousEmail);
        await upsertAdminAccount({
          email,
          password: options.password,
          name: user.fullName,
          role: user.role,
        });
        return;
      }
      await deleteAdminAccountByEmail(previousEmail);
      await upsertAdminAccountHash({
        email,
        passwordHash: existing.passwordHash,
        name: user.fullName,
        role: user.role,
      });
      return;
    }
    await deleteAdminAccountByEmail(previousEmail);
  }

  if (user.status === 'inactive') {
    await deleteAdminAccountByEmail(email);
    return;
  }

  if (options?.password) {
    await upsertAdminAccount({
      email,
      password: options.password,
      name: user.fullName,
      role: user.role,
    });
    return;
  }

  const account = await getAdminAccountByEmail(email);
  if (account) {
    await upsertAdminAccountHash({
      email,
      passwordHash: account.passwordHash,
      name: user.fullName,
      role: user.role,
    });
  }
}

export async function removeAuthAccountForEmail(email: string): Promise<void> {
  await deleteAdminAccountByEmail(email.toLowerCase());
}
