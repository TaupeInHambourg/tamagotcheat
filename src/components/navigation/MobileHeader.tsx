/**
 * MobileHeader Component
 *
 * Top navigation bar for mobile screens.
 * Includes back button, logo, and wallet display.
 *
 * Design Principles:
 * - Single Responsibility: Only handles mobile top navigation
 * - Mobile-first: Optimized for small screens
 * - Touch-friendly: Large tap targets
 * - Clean Architecture: Separates concerns
 *
 * @component
 */

'use client'

import Link from 'next/link'
import { WalletDisplay } from './WalletDisplay'
import { BackButton } from './BackButton'
import type { ReactNode } from 'react'

/**
 * Mobile header with back button and essential navigation
 */
export function MobileHeader (): ReactNode {
  return (
    <header className='md:hidden bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b-2 border-autumn-peach/50 shadow-lg'>
      <div className='flex justify-between items-center h-16 px-4'>
        {/* Back Button */}
        <BackButton />

        {/* Logo (centered) */}
        <Link
          href='/dashboard'
          className='flex-1 text-center text-lg font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent'
        >
          TamagoTcheat 🍂
        </Link>

        {/* Wallet Display - always visible */}
        <div className='flex items-center'>
          <WalletDisplay compact />
        </div>
      </div>
    </header>
  )
}
