'use client'

import Button from '@/components/Button'
import Link from 'next/link'
import MobileMenu from '@/components/home/MobileMenu'
import type { ReactNode } from 'react'

/**
 * Landing Page Header Component
 *
 * Main navigation header for public pages (landing page, gallery).
 * Provides navigation links and call-to-action button.
 * Includes mobile menu for tablet and phone screens.
 *
 * Design Principles:
 * - Single Responsibility: Only handles public page navigation
 * - Open/Closed: Extensible through navigation items
 * - Clean separation from authenticated AppHeader
 * - Responsive: Desktop nav + Mobile burger menu
 *
 * @component
 */
export default function LandingHeader (): ReactNode {
  const handleSignin = (): void => {
    window.location.href = '/sign-in'
  }

  return (
    <header className='fixed w-full top-0 z-50 bg-white/90 backdrop-blur-lg border-b-2 border-autumn-peach/50 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 inline-block'>
              TamagoTcheat 🍂
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link href='/#features' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Fonctionnalités
            </Link>
            <Link href='/#monsters' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Monstres
            </Link>
            <Link href='/gallery?source=landing' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Galerie 🌍
            </Link>
            <Link href='/#actions' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Actions
            </Link>
            <Link href='/#newsletter' className='text-chestnut-medium hover:text-autumn-cinnamon font-semibold transition-colors duration-200'>
              Newsletter
            </Link>
          </nav>

          {/* Desktop CTA Button */}
          <div className='hidden md:flex items-center'>
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

          {/* Mobile: Burger Menu only */}
          <div className='md:hidden'>
            <MobileMenu onSignin={handleSignin} />
          </div>
        </div>
      </div>
    </header>
  )
}
