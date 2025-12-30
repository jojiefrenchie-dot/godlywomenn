import requireAuth from './require-auth';
import ClientDashboardLayout from './client-layout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth check — redirects to /login if not authenticated
  await requireAuth();

  // If authenticated, render the client layout which contains the UI
  return <ClientDashboardLayout>{children}</ClientDashboardLayout>;
}