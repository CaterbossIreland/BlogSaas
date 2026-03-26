import type { PropsWithChildren } from "react";

import { DashboardShell } from "../../components/dashboard-shell";
import { getConnectedTenantSummaries } from "../../lib/merchant-console";

export const dynamic = "force-dynamic";

export default async function MerchantLayout({ children }: PropsWithChildren) {
  const tenants = await getConnectedTenantSummaries();

  return <DashboardShell tenants={tenants}>{children}</DashboardShell>;
}
