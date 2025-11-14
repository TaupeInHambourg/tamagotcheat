'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'
import type { NavigationItem } from '@/types/navigation.types'

/**
 * Barre de navigation en bas pour tous les écrans
 *
 * Affiche une navigation de type "app mobile" en bas de l'écran.
 * Visible sur tous les formats (mobile, tablette, desktop).
 * Design adapté au style TamagoTcheat avec palette autumn.
 *
 * Responsabilité unique : Gérer la navigation bottom universelle de l'application
 *
 * Principes appliqués :
 * - Single Responsibility : Gère uniquement la navigation bottom
 * - Open/Closed : Extensible via la liste navItems
 * - Liskov Substitution : Respecte le contrat NavigationItem
 * - Interface Segregation : Utilise des interfaces ciblées
 * - Dependency Inversion : Dépend de l'abstraction NavigationItem
 */
export default function BottomNav (): React.ReactNode {
  const pathname = usePathname()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  const isActive = (path: string): boolean => {
    return pathname === path
  }

  const navItems: NavigationItem[] = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/creatures', label: 'Créatures', icon: '🐾' },
    { href: '/quests', label: 'Quêtes', icon: '🏆' },
    { href: '/shop', label: 'Boutique', icon: '🛍️' },
    { href: '/wallet', label: 'Koins', icon: '💰' }
  ]

  const externalLinks = [
    { href: 'https://documentation-tamagotcheat.vercel.app/', label: 'Docs', icon: '📚' }
  ]

  return (
    <>
      {/* Barre de navigation fixée en bas - Visible sur tous les écrans */}
      <nav className='fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg z-50 border-t-2 border-autumn-peach/50 shadow-lg'>
        <div className='grid grid-cols-6 gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 pb-safe max-w-7xl mx-auto'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 sm:py-3 px-1 sm:px-2 rounded-xl font-semibold transition-all duration-200 touch-manipulation active:scale-95 ${
                isActive(item.href)
                  ? 'bg-gradient-to-br from-autumn-peach to-autumn-coral text-chestnut-deep shadow-md'
                  : 'text-chestnut-medium active:bg-autumn-cream/50 hover:bg-autumn-cream/30'
              }`}
            >
              <span className='text-xl sm:text-2xl'>{item.icon}</span>
              <span className='text-[10px] sm:text-xs leading-tight'>{item.label}</span>
            </Link>
          ))}
          {externalLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target='_blank'
              rel='noopener noreferrer'
              className='flex flex-col items-center justify-center gap-1 py-2 sm:py-3 px-1 sm:px-2 rounded-xl font-semibold transition-all duration-200 touch-manipulation active:scale-95 text-chestnut-medium active:bg-autumn-cream/50 hover:bg-autumn-cream/30'
            >
              <span className='text-xl sm:text-2xl'>{item.icon}</span>
              <span className='text-[10px] sm:text-xs leading-tight'>{item.label}</span>
            </a>
          ))}

        </div>
      </nav>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div
          className='fixed inset-0 bg-chestnut-deep/60 backdrop-blur-md z-50 flex items-end justify-center animate-fade-in-up'
          onClick={() => { setShowLogoutConfirm(false) }}
        >
          <div
            className='card-cozy w-full max-w-md mx-4 mb-24 animate-scale-in'
            onClick={(e) => { e.stopPropagation() }}
          >
            <div className='text-center mb-6'>
              <div className='text-6xl mb-4 animate-wiggle'>🤔</div>
              <h3 className='heading-sm mb-2'>
                Tu pars déjà ?
              </h3>
              <p className='text-lg text-cozy'>
                Tes créatures vont te manquer ! 😢
              </p>
            </div>

            <div className='flex flex-col gap-3'>
              <button
                onClick={handleLogout}
                className='btn-maple w-full text-lg py-4'
              >
                <span className='flex items-center justify-center gap-2'>
                  <span className='text-xl'>🚪</span>
                  <span>Oui, me déconnecter</span>
                </span>
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false) }}
                className='btn-soft w-full text-lg py-4'
              >
                <span className='flex items-center justify-center gap-2'>
                  <span className='text-xl'>💖</span>
                  <span>Non, rester</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
