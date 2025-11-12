/**
 * Gallery Loading State
 *
 * Displays during page transition to gallery page.
 *
 * @module app/gallery
 */

import { PageLoader } from '@/components/common/PageLoader'

export default function GalleryLoading (): React.ReactNode {
  return <PageLoader />
}
