'use client'

import Button from './Button'
import Link from 'next/link'
import type { ReactNode } from 'react'

export default function Header (): ReactNode {
  return (
    <header className='fixed w-full top-0 bg-white/80 backdrop-blur-sm border-b border-pink-flare-100 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='text-2xl font-bold text-pink-flare-600'>
              TamagoTcheat
            </Link>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link href='#features' className='text-pink-flare-600 hover:text-pink-flare-700'>
              Fonctionnalités
            </Link>
            <Link href='#monsters' className='text-pink-flare-600 hover:text-pink-flare-700'>
              Monstres
            </Link>
            <Link href='#actions' className='text-pink-flare-600 hover:text-pink-flare-700'>
              Actions
            </Link>
            <Link href='#newsletter' className='text-pink-flare-600 hover:text-pink-flare-700'>
              Newsletter
            </Link>
          </nav>

          {/* CTA Button */}
          <div className='flex items-center'>
            <Button
              variant='primary'
              size='md'
            >
              Créer mon monstre
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
