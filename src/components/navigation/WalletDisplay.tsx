'use client'

import Link from 'next/link'
import { useWallet } from '@/contexts/WalletContext'

/**
 * Wallet Display Component
 *
 * Shows current Koins and Gifts balance with link to wallet page.
 * Uses WalletContext for real-time updates without unnecessary re-fetching.
 * Displays values immediately (starts at 0) and updates smoothly when data arrives.
 *
 * @architecture Presentation Layer
 * @principle Single Responsibility - Only displays wallet balance
 * @principle Clean Code - No loading states, smooth transitions
 */
export function WalletDisplay ({ compact = false }: { compact?: boolean }): React.JSX.Element {
  const { koins, gifts } = useWallet()

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
