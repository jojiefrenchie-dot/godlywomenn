import requireAuth from './require-auth';
import DashboardPageClient from './page.client';

export default async function Page() {
  await requireAuth();
  return <DashboardPageClient />;
}