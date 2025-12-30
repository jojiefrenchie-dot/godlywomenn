import requireAuth from '../require-auth';
import MarketplacePageClient from './page.client';

export default async function Page() {
  await requireAuth();
  return <MarketplacePageClient />;
}
