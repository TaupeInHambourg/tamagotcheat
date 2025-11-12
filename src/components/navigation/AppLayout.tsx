'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { WalletProvider } from '@/contexts/WalletContext'
import AppHeader from './AppHeader'
import { MobileHeader } from './MobileHeader'
import BottomNav from './BottomNav'

interface AppLayoutProps {
  children: React.ReactNode
}

/**
 * Layout principal de l'application avec navigation
 *
 * Ce composant wrap les pages authentifiées et ajoute :
 * - WalletProvider pour la gestion globale du wallet
 * - AppHeader en haut sur desktop (md et plus)
 * - MobileHeader en haut sur mobile (moins de md)
 * - BottomNav en bas pour tous les écrans (toujours visible)
 * - Padding bottom pour éviter que le contenu soit caché par la barre
 *
 * Mobile-first approach: Navigation optimisée pour mobile avec bottom nav
 * universelle accessible sur tous les formats d'écran.
 *
 * Responsabilité unique : Orchestrer l'affichage de la navigation
 * en fonction de la taille de l'écran
 *
 * Principes appliqués :
 * - Single Responsibility : Orchestre uniquement la navigation
 * - Open/Closed : Extensible via composition de composants
 * - Liskov Substitution : Les composants enfants sont substituables
 * - Interface Segregation : Interface simple avec children
 * - Dependency Inversion : Dépend des abstractions AppHeader, MobileHeader et BottomNav
 *
 * @param {AppLayoutProps} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu de la page
 */
export default function AppLayout ({ children }: AppLayoutProps): React.ReactNode {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const session = await authClient.getSession()
        if (session?.data?.user?.id != null) {
          setUserId(session.data.user.id)
        }
      } catch (error) {
        console.error('[AppLayout] Failed to fetch user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUser()
  }, [])

  // Show loading while fetching user
  if (isLoading || userId == null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-autumn-gradient'>
        <div className='text-center'>
          <div className='text-6xl mb-4 animate-bounce'>🍂</div>
          <p className='text-chestnut-deep font-semibold'>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <WalletProvider userId={userId}>
      <div className='min-h-screen flex flex-col bg-autumn-gradient bg-cozy-pattern'>
        {/* Header desktop (masqué sur mobile) */}
        <AppHeader />

        {/* Header mobile (masqué sur desktop) */}
        <MobileHeader />

        {/* Contenu principal avec padding pour la barre mobile */}
        <main className='flex-1 pb-20 pt-0'>
          {children}
        </main>

        {/* Navigation bottom (visible sur tous les écrans) */}
        <BottomNav />
      </div>
    </WalletProvider>
  )
}
