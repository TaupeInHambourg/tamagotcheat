'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getKoinsBalance } from '@/actions/wallet.actions'

/**
 * Wallet Display Component
 *
 * Shows current Koins balance with link to wallet page.
 * Polls for balance updates after purchases.
 *
 * @architecture Presentation Layer
 * @principle Single Responsibility - Only displays wallet balance
 */
export function WalletDisplay ({ userId }: { userId: string }): React.JSX.Element {
  const [koins, setKoins] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchKoins = async (): Promise<void> => {
      try {
        const balance = await getKoinsBalance(userId)
        if (mounted) {
          setKoins(balance)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch Koins balance:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchKoins()

    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      void fetchKoins()
    }, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className='flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm'>
        <span className='text-xl'>💰</span>
        <span className='text-sm text-pink-flare-600 animate-pulse'>...</span>
      </div>
    )
  }

  return (
    <Link
      href='/wallet'
      className='flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200'
      title='Go to wallet'
    >
      <span className='text-xl'>💰</span>
      <span className='text-sm font-semibold text-pink-flare-700'>{koins}</span>
    </Link>
  )
}
