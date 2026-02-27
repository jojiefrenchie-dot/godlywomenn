import ClientDashboardLayout from './client-layout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Client-side auth check is handled in the client layout component
  return <ClientDashboardLayout>{children}</ClientDashboardLayout>;
}