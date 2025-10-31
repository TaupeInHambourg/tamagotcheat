/**
 * Shop Page - Accessories Store
 *
 * Main page for browsing and purchasing accessories.
 * Server component that fetches user data and delegates to client component.
 *
 * Design Principles:
 * - Single Responsibility: Only handles data fetching and layout
 * - Clean Architecture: Separates data fetching from UI
 *
 * @page
 */

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AppLayout } from '@/components/navigation'
import ShopClient from '@/components/shop/ShopClient'
import { getKoinsBalance } from '@/actions/wallet.actions'
import { getMyAccessories } from '@/actions/accessories.actions'

export default async function ShopPage (): Promise<React.ReactNode> {
  // Verify authentication
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session?.user?.id == null) {
    redirect('/sign-in')
  }

  // Fetch user's Koins balance
  const userKoins = await getKoinsBalance(session.user.id)

  // Fetch user's owned accessories
  const ownedAccessories = await getMyAccessories()
  const ownedAccessoryIds = ownedAccessories.map(acc => acc.accessoryId)

  return (
    <AppLayout>
      <ShopClient
        userKoins={userKoins}
        ownedAccessoryIds={ownedAccessoryIds}
      />
    </AppLayout>
  )
}
