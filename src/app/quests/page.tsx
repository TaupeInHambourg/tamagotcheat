/**
 * Quests Page
 *
 * Server component that ensures authentication before showing quests.
 * Redirects to sign-in if not authenticated.
 *
 * @module app/quests
 */

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/navigation'
import QuestsContent from './quests-content'

export const metadata = {
  title: 'Quêtes - TamagoTcheat',
  description: 'Complète des quêtes pour gagner des récompenses'
}

export default async function QuestsPage (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <AppLayout>
      <QuestsContent />
    </AppLayout>
  )
}
