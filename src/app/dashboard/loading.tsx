/**
 * Dashboard Loading State
 *
 * Displays during page transition to dashboard.
 * Once loaded, individual components use skeletons if needed.
 *
 * @module app/dashboard
 */

import { PageLoader } from '@/components/common/PageLoader'

export default function DashboardLoading (): React.ReactNode {
  return <PageLoader />
}
