'use client'

import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { WalletDisplay } from './WalletDisplay'
import { BackButton } from './BackButton'
import Button from '../Button'

/**
 * Header de l'application pour desktop
 *
 * Affiche la navigation principale en haut de l'écran sur les écrans desktop.
 * Design adapté au style TamagoTcheat avec palette pink-flare.
 * Inclut un bouton back pour la navigation.
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
  const handleLogout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  return (
    <header className='hidden md:block bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-t-2 border-autumn-peach/50 shadow-lg'>
      <nav className='max-w-7xl mx-auto px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Back Button + Logo */}
          <div className='flex items-center gap-4'>
            <BackButton />
            <Link href='/dashboard' className='text-2xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 inline-block'>
              TamagoTcheat 🍂
            </Link>
          </div>

          {/* Actions utilisateur - Wallet et Déconnexion uniquement */}
          <div className='flex items-center space-x-3'>
            {/* Wallet display - always visible */}
            <WalletDisplay />

            {/* Logout button */}
            <Button
              onClick={handleLogout}
              variant='ghost'
              size='md'
              className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold'
            >
              <span className='text-xl'>🚪</span>
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
