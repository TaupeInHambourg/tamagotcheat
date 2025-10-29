'use client'

import AppHeader from './AppHeader'
import BottomNav from './BottomNav'

interface AppLayoutProps {
  children: React.ReactNode
}

/**
 * Layout principal de l'application avec navigation
 *
 * Ce composant wrap les pages authentifiées et ajoute :
 * - AppHeader en haut sur desktop (md et plus)
 * - BottomNav en bas sur mobile/tablette (moins de md)
 * - Padding bottom sur mobile pour éviter que le contenu soit caché par la barre
 *
 * Responsabilité unique : Orchestrer l'affichage de la navigation
 * en fonction de la taille de l'écran
 *
 * Principes appliqués :
 * - Single Responsibility : Orchestre uniquement la navigation
 * - Open/Closed : Extensible via composition de composants
 * - Liskov Substitution : Les composants enfants sont substituables
 * - Interface Segregation : Interface simple avec children
 * - Dependency Inversion : Dépend des abstractions AppHeader et BottomNav
 *
 * @param {AppLayoutProps} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu de la page
 */
export default function AppLayout ({ children }: AppLayoutProps): React.ReactNode {
  return (
    <div className='min-h-screen flex flex-col bg-autumn-gradient bg-cozy-pattern'>
      {/* Header desktop (masqué sur mobile) */}
      <AppHeader />

      {/* Contenu principal avec padding pour la barre mobile */}
      <main className='flex-1 pb-20 md:pb-0'>
        {children}
      </main>

      {/* Navigation mobile (masquée sur desktop) */}
      <BottomNav />
    </div>
  )
}
