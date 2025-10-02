import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/dashboard/dashboard-content'

export default async function DashboardPage () {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <div>
      <DashboardContent session={session} />
    </div>
  )
}
