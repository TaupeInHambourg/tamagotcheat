'use client'

import Button from '@/components/Button'
import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Landing Page Header Component
 *
 * Main navigation header for the landing page with autumn/cozy styling.
 * Provides navigation links and call-to-action button.
 *
 * Features:
 * - Fixed positioning with backdrop blur
 * - Responsive navigation menu
 * - Smooth hover animations
 * - Gradient branding
 *
 * Follows Single Responsibility Principle:
 * - Only handles landing page navigation
 * - Does not manage authentication state
 *
 * @component
 */
export default function Header (): ReactNode {
  /**
   * Handles navigation to sign-in page
   * Uses client-side navigation for better UX
   */
  const handleSignin = (): void => {
    window.location.href = '/sign-in'
  }

  return (
    <header className='fixed w-full top-0 z-50 bg-white/90 backdrop-blur-lg border-b-2 border-autumn-peach/50 shadow-lg'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='text-2xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 inline-block'>
              TamagoTcheat 🍂
            </Link>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link href='#features' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Fonctionnalités
            </Link>
            <Link href='#monsters' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Monstres
            </Link>
            <Link href='/gallery?source=landing' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Galerie 🌍
            </Link>
            <Link href='#actions' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Actions
            </Link>
            <Link href='#newsletter' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Newsletter
            </Link>
          </nav>

          {/* CTA Button */}
          <div className='flex items-center'>
            <Button
              variant='primary'
              size='md'
              onClick={handleSignin}
            >
              <span className='flex items-center gap-2'>
                <span>Créer mon monstre</span>
                <span>✨</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
