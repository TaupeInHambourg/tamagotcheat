'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { WalletDisplay } from './WalletDisplay'
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
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      const session = await authClient.getSession()
      if (session?.data?.user?.id != null) {
        setUserId(session.data.user.id)
      }
    }

    void fetchUser()
  }, [])

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
    { href: '/shop', label: 'Boutique', icon: '🛍️' }
  ]

  return (
    <header className='hidden md:block bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b-2 border-autumn-peach/50 shadow-lg'>
      <nav className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo */}
          <Link href='/dashboard' className='text-2xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 inline-block'>
            TamagoTcheat 🍂
          </Link>

          {/* Navigation principale */}
          <div className='flex items-center space-x-3'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-autumn-peach to-autumn-coral text-chestnut-deep shadow-md'
                    : 'text-chestnut-medium hover:bg-autumn-cream hover:text-chestnut-deep'
                }`}
              >
                <span className='text-xl'>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions utilisateur */}
          <div className='flex items-center space-x-3'>
            {/* Wallet display */}
            {userId != null && <WalletDisplay userId={userId} />}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-maple-light text-maple-deep hover:bg-maple-soft transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md'
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
