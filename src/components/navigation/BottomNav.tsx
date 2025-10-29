'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'
import type { NavigationItem } from '@/types/navigation.types'

/**
 * Barre de navigation en bas pour mobile et tablette
 *
 * Affiche une navigation de type "app mobile" en bas de l'écran.
 * Design adapté au style TamagoTcheat avec palette pink-flare.
 *
 * Responsabilité unique : Gérer la navigation mobile/tablette de l'application
 *
 * Principes appliqués :
 * - Single Responsibility : Gère uniquement la navigation mobile
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
    { href: '/wallet', label: 'Wallet', icon: '💰' }
  ]

  return (
    <>
      {/* Barre de navigation fixée en bas */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-pink-flare-100 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'>
        <div className='grid grid-cols-4 gap-1 px-2 py-2 safe-area-inset-bottom'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 ${
                isActive(item.href)
                  ? 'bg-pink-flare-100 text-pink-flare-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className='text-2xl'>{item.icon}</span>
              <span className='text-xs'>{item.label}</span>
            </Link>
          ))}

          {/* Bouton Quitter */}
          <button
            onClick={() => { setShowLogoutConfirm(true) }}
            className='flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 active:scale-95'
          >
            <span className='text-2xl'>🚪</span>
            <span className='text-xs'>Quitter</span>
          </button>
        </div>
      </nav>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in'
          onClick={() => { setShowLogoutConfirm(false) }}
        >
          <div
            className='bg-white rounded-t-3xl w-full max-w-md p-6 mb-20 shadow-2xl animate-slide-up'
            onClick={(e) => { e.stopPropagation() }}
          >
            <div className='text-center mb-6'>
              <div className='text-6xl mb-4'>🤔</div>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                Tu pars déjà ?
              </h3>
              <p className='text-lg text-gray-600'>
                Tes créatures vont te manquer ! 😢
              </p>
            </div>

            <div className='flex flex-col gap-3'>
              <button
                onClick={handleLogout}
                className='w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-lg py-4 px-6 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 transform active:scale-95 shadow-lg'
              >
                <span className='flex items-center justify-center gap-2'>
                  <span className='text-xl'>🚪</span>
                  <span>Oui, me déconnecter</span>
                </span>
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false) }}
                className='w-full bg-gray-200 text-gray-800 font-bold text-lg py-4 px-6 rounded-xl hover:bg-gray-300 transition-all duration-200 transform active:scale-95'
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

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { 
            transform: translateY(100%);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}
      </style>
    </>
  )
}
