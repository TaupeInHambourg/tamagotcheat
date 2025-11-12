/**
 * Authenticated Layout Wrapper
 *
 * Wraps AppLayout with WalletProvider for authenticated routes.
 * Automatically fetches user session and provides wallet context.
 *
 * @component
 */

'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { authClient } from '@/lib/auth-client'
import { WalletProvider } from '@/contexts/WalletContext'
import AppLayout from './AppLayout'

interface AuthenticatedLayoutProps {
  children: ReactNode
}

/**
 * Layout wrapper that provides authentication and wallet context
 */
export default function AuthenticatedLayout ({ children }: AuthenticatedLayoutProps): ReactNode {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const session = await authClient.getSession()
        if (session?.data?.user?.id != null) {
          setUserId(session.data.user.id)
        }
      } catch (error) {
        console.error('[AuthenticatedLayout] Failed to fetch user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUser()
  }, [])

  // Don't render until we have userId
  if (isLoading || userId == null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-autumn-gradient'>
        <div className='text-center'>
          <div className='text-6xl mb-4 animate-bounce'>🍂</div>
          <p className='text-chestnut-deep font-semibold'>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <WalletProvider userId={userId}>
      <AppLayout>
        {children}
      </AppLayout>
    </WalletProvider>
  )
}
