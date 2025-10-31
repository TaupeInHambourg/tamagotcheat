'use client'

import { type Monster } from '@/types/monster.types'
import { MonsterCard } from './monster-card'

// Type alias for better compatibility
export type DashboardMonster = Monster

const mergeClasses = (...values: Array<string | undefined>): string => values.filter(Boolean).join(' ')

interface MonstersListProps {
  monsters: DashboardMonster[]
  className?: string
}

function MonstersList ({ monsters, className }: MonstersListProps): React.ReactNode {
  if (monsters === null || monsters === undefined || monsters.length === 0) {
    return (
      <div className={mergeClasses('mt-10 w-full rounded-2xl bg-gradient-to-br from-autumn-cream to-autumn-peach/30 p-12 text-center shadow-lg border border-autumn-peach', className)}>
        <h2 className='text-2xl font-bold text-chestnut-deep mb-3'>Tu n&apos;as pas encore de compagnon</h2>
        <p className='text-lg text-chestnut-medium'>Clique sur &quot;Créer une créature&quot; pour lancer ta première adoption magique.</p>
      </div>
    )
  }

  return (
    <section className={mergeClasses('mt-8 w-full space-y-10', className)}>
      <header className='space-y-3'>
        <h2 className='text-3xl font-bold text-chestnut-deep'>Tes compagnons animés</h2>
        <p className='text-lg text-chestnut-medium'>Un coup d&apos;oeil rapide sur ta ménagerie digitale pour préparer la prochaine aventure.</p>
      </header>

      <div className='grid gap-8 sm:grid-cols-2 xl:grid-cols-3'>
        {monsters.map((monster) => {
          const cardKey = monster.id ?? monster._id ?? monster.name

          return (
            <MonsterCard
              key={cardKey}
              initialMonster={monster}
              autoRefresh
            />
          )
        })}
      </div>
    </section>
  )
}

export default MonstersList
