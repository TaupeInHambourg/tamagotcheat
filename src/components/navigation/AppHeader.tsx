'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import type { NavigationItem } from '@/types/navigation.types'

/**
 * Header de l'application pour desktop
 *
 * Affiche la navigation principale en haut de l'écran sur les écrans desktop.
 * Design adapté au style TamagoTcheat avec palette pink-flare.
 *
 * Responsabilité unique : Gérer la navigation desktop de l'application
 *
 * Principes appliqués :
 * - Single Responsibility : Gère uniquement la navigation desktop
 * - Open/Closed : Extensible via la liste navItems
 * - Liskov Substitution : Respecte le contrat NavigationItem
 * - Interface Segregation : Utilise des interfaces ciblées
 * - Dependency Inversion : Dépend de l'abstraction NavigationItem
 */
export default function AppHeader (): React.ReactNode {
  const pathname = usePathname()

  const handleLogout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  const isActive = (path: string): boolean => {
    return pathname === path
  }

  const navItems: NavigationItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/creatures', label: 'Mes Créatures', icon: '🐾' },
    { href: '/wallet', label: 'Mon Wallet', icon: '💰' }
  ]

  return (
    <header className='hidden md:block bg-white/80 backdrop-blur-md border-b border-pink-flare-100 sticky top-0 z-50 shadow-sm'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link href='/dashboard' className='flex-shrink-0 group'>
            <div className='flex items-center space-x-3 transform transition-transform duration-200 group-hover:scale-105'>
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-r from-pink-flare-400 to-pink-flare-500 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity' />
                <span className='text-3xl relative'>🎮</span>
              </div>
              <span className='text-2xl font-bold text-transparent bg-gradient-to-r from-pink-flare-600 to-pink-flare-800 bg-clip-text'>
                TamagoTcheat
              </span>
            </div>
          </Link>

          {/* Navigation principale */}
          <div className='flex items-center space-x-2'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                  isActive(item.href)
                    ? 'bg-pink-flare-100 text-pink-flare-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className='text-xl'>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions utilisateur */}
          <div className='flex items-center space-x-2'>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 transform hover:scale-105'
            >
              <span className='text-xl'>🚪</span>
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
