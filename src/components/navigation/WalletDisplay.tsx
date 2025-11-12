'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getKoinsBalance } from '@/actions/wallet.actions'
import { getUserGiftsBalance } from '@/actions/quests.actions'

/**
 * Wallet Display Component
 *
 * Shows current Koins and Gifts balance with link to wallet page.
 * Polls for balance updates after purchases and quest completions.
 *
 * @architecture Presentation Layer
 * @principle Single Responsibility - Only displays wallet balance
 */
export function WalletDisplay ({ userId }: { userId: string }): React.JSX.Element {
  const [koins, setKoins] = useState<number>(0)
  const [gifts, setGifts] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchBalances = async (): Promise<void> => {
      try {
        const [koinsBalance, giftsBalance] = await Promise.all([
          getKoinsBalance(userId),
          getUserGiftsBalance()
        ])

        if (mounted) {
          setKoins(koinsBalance)
          setGifts(giftsBalance)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch balances:', error)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchBalances()

    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      void fetchBalances()
    }, 10000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className='flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-autumn-peach to-autumn-coral text-chestnut-deep shadow-md'>
        <div className='flex items-center gap-2'>
          <span className='text-xl'>💰</span>
          <span className='text-sm animate-pulse'>...</span>
        </div>
        <div className='w-px h-6 bg-chestnut-deep/20' />
        <div className='flex items-center gap-2'>
          <span className='text-xl'>🎁</span>
          <span className='text-sm animate-pulse'>...</span>
        </div>
      </div>
    )
  }

  return (
    <Link href='/wallet'>
      <div className='flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-autumn-peach to-autumn-coral text-chestnut-deep shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95'>
        <div className='flex items-center gap-2'>
          <span className='text-xl'>💰</span>
          <span className='text-sm font-semibold'>{koins}</span>
          <span className='text-xs font-medium opacity-80'>Koins</span>
        </div>
        <div className='w-px h-6 bg-chestnut-deep/20' />
        <div className='flex items-center gap-2'>
          <span className='text-xl'>🎁</span>
          <span className='text-sm font-semibold'>{gifts}</span>
          <span className='text-xs font-medium opacity-80'>Cadeaux</span>
        </div>
      </div>
    </Link>
  )
}
