import { redirect } from 'next/navigation';

export default function AdminWaiterRedirectPage() {
  redirect('/admin/cashier');
}
