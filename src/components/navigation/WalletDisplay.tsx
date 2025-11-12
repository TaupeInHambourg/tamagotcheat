'use client'

import Link from 'next/link'
import { useWallet } from '@/contexts/WalletContext'

/**
 * Wallet Display Component
 *
 * Shows current Koins and Gifts balance with link to wallet page.
 * Uses WalletContext for real-time updates without unnecessary re-fetching.
 *
 * @architecture Presentation Layer
 * @principle Single Responsibility - Only displays wallet balance
 */
export function WalletDisplay ({ compact = false }: { compact?: boolean }): React.JSX.Element {
  const { koins, gifts, isLoading } = useWallet()

  // Show loading state only on initial load
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${compact ? 'gap-1.5 px-2 py-1' : 'gap-3 px-4 py-2'} rounded-xl bg-gradient-to-r from-autumn-peach to-autumn-coral text-chestnut-deep shadow-md`}>
        <div className='flex items-center gap-1'>
          <span className={compact ? 'text-base' : 'text-xl'}>💰</span>
          <span className='text-xs animate-pulse'>...</span>
        </div>
        {!compact && (
          <>
            <div className='w-px h-6 bg-chestnut-deep/20' />
            <div className='flex items-center gap-1'>
              <span className='text-xl'>🎁</span>
              <span className='text-xs animate-pulse'>...</span>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <Link href='/wallet'>
      <div className={`flex items-center ${compact ? 'gap-1.5 px-2 py-1' : 'gap-3 px-4 py-2'} rounded-xl bg-gradient-to-r from-autumn-peach to-autumn-coral text-chestnut-deep shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}>
        <div className='flex items-center gap-1'>
          <span className={compact ? 'text-base' : 'text-xl'}>💰</span>
          <span className={`font-semibold ${compact ? 'text-xs' : 'text-sm'} transition-all duration-300`}>{koins}</span>
          {!compact && <span className='text-xs font-medium opacity-80'>Koins</span>}
        </div>
        {!compact && (
          <>
            <div className='w-px h-6 bg-chestnut-deep/20' />
            <div className='flex items-center gap-1'>
              <span className='text-xl'>🎁</span>
              <span className='text-sm font-semibold transition-all duration-300'>{gifts}</span>
              <span className='text-xs font-medium opacity-80'>Cadeaux</span>
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
