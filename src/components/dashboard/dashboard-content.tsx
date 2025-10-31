'use client'

import { Monster } from '@/types/monster.types'
import type { OwnedAccessory } from '@/types/accessory.types'
import { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import { createMonster } from '@/actions/monsters.actions'
import MonstersList from '@/components/monsters/monsters-list'
import { authClient } from '@/lib/auth-client'

import { DashboardHeader } from './components/DashboardHeader'
import { StatsCard } from './components/StatsCard'
import { MoodTip } from './components/MoodTip'
import { DashboardLayout } from './components/DashboardLayout'
import CreateMonsterModal from '../modals/create-monster-modal'
import AccessoriesSection from './AccessoriesSection'
import { useMemo, useState } from 'react'

type Session = typeof authClient.$Infer.Session

const MOOD_LABELS: Record<string, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

const deriveDisplayName = (session: Session): string => {
  const rawName = session.user?.name
  if (typeof rawName === 'string' && rawName.trim().length > 0) {
    return rawName.trim().split(' ')[0]
  }

  const fallbackEmail = session.user?.email
  if (typeof fallbackEmail === 'string' && fallbackEmail.includes('@')) {
    return fallbackEmail.split('@')[0]
  }

  return 'Gardien.ne'
}

interface DashboardContentProps {
  session: Session
  monsters: Monster[]
  accessories: OwnedAccessory[]
}

function DashboardContent ({ session, monsters, accessories }: DashboardContentProps): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const displayName = useMemo(() => deriveDisplayName(session), [session])

  // Calculate favorite mood for MoodTip component
  const favoriteMoodMessage = useMemo(() => {
    if (!Array.isArray(monsters) || monsters.length === 0) {
      return 'Pas encore de vibe détectée. Crée ton premier monstre pour lancer la fête !'
    }

    const moodCounter: Record<string, number> = {}
    monsters.forEach((monster) => {
      const mood = monster.state as string
      if (Object.keys(MOOD_LABELS).includes(mood)) {
        moodCounter[mood] = (moodCounter[mood] ?? 0) + 1
      }
    })

    const favoriteMood = Object.entries(moodCounter)
      .sort((a, b) => b[1] - a[1])[0]?.[0]

    if (favoriteMood === undefined) {
      return 'Tes créatures attendent encore de montrer leur humeur préférée. Essaie de les cajoler ou de leur donner un snack !'
    }

    const favoriteMoodLabel = MOOD_LABELS[favoriteMood] ?? favoriteMood
    return `Aujourd'hui, ta bande est plutôt ${favoriteMoodLabel.toLowerCase()}. Prévois une activité assortie pour maintenir la bonne humeur !`
  }, [monsters])

  const handleLogout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  const handleCreateMonster = (): void => {
    setIsModalOpen(true)
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
  }

  const handleMonsterSubmit = (values: CreateMonsterFormValues): void => {
    void createMonster(values).then(() => {
      window.location.reload()
    })
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        displayName={displayName}
        onCreateMonster={handleCreateMonster}
        onLogout={handleLogout}
      />

      <div className='mt-8'>
        <StatsCard monsters={monsters} />
      </div>

      <section className='mt-12 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
        <div>
          <MonstersList monsters={monsters} className='mt-0' />
        </div>
        <aside className='flex flex-col gap-6'>
          <MoodTip favoriteMoodMessage={favoriteMoodMessage} />
        </aside>
      </section>

      {/* Accessories Section */}
      <section className='mt-12'>
        <AccessoriesSection accessories={accessories} />
      </section>

      <CreateMonsterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleMonsterSubmit}
      />
    </DashboardLayout>
  )
}

export default DashboardContent
