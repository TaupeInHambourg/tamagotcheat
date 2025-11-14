/**
 * MobileMenu - Mobile navigation menu component
 *
 * Hamburger menu for mobile and tablet navigation on landing page.
 * Provides access to page sections and CTA button.
 *
 * Design Principles:
 * - Single Responsibility: Only handles mobile menu UI and state
 * - Open/Closed: Extensible through navigation items
 * - Interface Segregation: Simple props interface
 *
 * @component
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/Button'

interface MobileMenuProps {
  onSignin: () => void
}

interface NavItem {
  href: string
  label: string
  emoji: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/#features', label: 'Fonctionnalités', emoji: '✨' },
  { href: '/#monsters', label: 'Monstres', emoji: '🦎' },
  { href: '/gallery?source=landing', label: 'Galerie', emoji: '🌍' },
  { href: '/#actions', label: 'Actions', emoji: '🎮' },
  { href: '/#newsletter', label: 'Newsletter', emoji: '📧' }
]

export default function MobileMenu ({ onSignin }: MobileMenuProps): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = (): void => {
    setIsOpen(!isOpen)
  }

  const closeMenu = (): void => {
    setIsOpen(false)
  }

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSignin = (): void => {
    closeMenu()
    onSignin()
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className='md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-autumn-cream/30 transition-colors duration-200'
        aria-label='Toggle menu'
        aria-expanded={isOpen}
      >
        <span className={`block w-6 h-0.5 bg-chestnut-deep transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-6 h-0.5 bg-chestnut-deep transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 bg-chestnut-deep transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-chestnut-deep/60 backdrop-blur-sm z-40 md:hidden'
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 w-80 max-w-[85vw] h-screen bg-white/95 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className='flex flex-col h-full p-6'>
          {/* Close Button */}
          <div className='flex justify-end mb-4'>
            <button
              onClick={closeMenu}
              className='p-2 rounded-lg hover:bg-autumn-cream/50 transition-colors duration-200'
              aria-label='Fermer le menu'
            >
              <svg
                className='w-6 h-6 text-chestnut-deep'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          {/* CTA Button at top */}
          <div className='mb-6 pb-6 border-b-2 border-autumn-peach/30'>
            <Button
              variant='primary'
              size='md'
              onClick={handleSignin}
              className='w-full'
            >
              <span className='flex items-center justify-center gap-2'>
                <span>Se connecter</span>
                <span>✨</span>
              </span>
            </Button>
          </div>

          {/* Navigation Links */}
          <div className='flex-1 space-y-2'>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className='flex items-center gap-3 px-4 py-3 rounded-xl text-chestnut-medium hover:text-autumn-cinnamon hover:bg-autumn-cream/50 transition-all duration-200 font-semibold'
              >
                <span className='text-2xl'>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Footer info */}
          <div className='pt-6 border-t-2 border-autumn-peach/30 text-center text-sm text-chestnut-medium'>
            <p>© 2025 TamagoTcheat</p>
            <p className='mt-1'>Tous droits réservés ✨</p>
          </div>
        </nav>
      </div>
    </>
  )
}
