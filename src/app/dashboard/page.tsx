import { getMonsters } from '@/actions/monsters.actions'
import { getMyAccessories } from '@/actions/accessories.actions'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/dashboard/dashboard-content'
import { AppLayout } from '@/components/navigation'

export default async function DashboardPage (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  const monsters = await getMonsters()
  const userAccessories = await getMyAccessories()

  return (
    <AppLayout>
      <DashboardContent session={session} monsters={monsters} accessories={userAccessories} />
    </AppLayout>
  )
}
