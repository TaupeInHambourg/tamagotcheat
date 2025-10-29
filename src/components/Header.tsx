'use client'

import Button from './Button'
import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Header de la landing page - Style Cosy Automnal
 *
 * Responsabilité unique : Navigation de la page d'accueil
 */
export default function Header (): ReactNode {
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
