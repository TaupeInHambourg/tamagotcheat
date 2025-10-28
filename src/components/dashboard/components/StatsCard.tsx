import { useMemo } from 'react'
import { type Monster } from '@/types/monster.types'

interface StatsCardProps {
  monsters: Monster[]
  userInitial: string
  displayName: string
  sessionEmail: string
}

const MOOD_LABELS: Record<string, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

export function StatsCard ({ monsters, userInitial, displayName, sessionEmail }: StatsCardProps): React.ReactNode {
  const stats = useMemo(() => {
    if (!Array.isArray(monsters) || monsters.length === 0) {
      return {
        totalMonsters: 0,
        highestLevel: 1,
        latestAdoption: null as Date | null,
        favoriteMood: null as string | null,
        moodVariety: 0
      }
    }

    let highestLevel = 1
    let latestAdoption: Date | null = null
    const moodCounter: Record<string, number> = {}
    const moodSet = new Set<string>()

    monsters.forEach((monster) => {
      const level = monster.level ?? 1
      if (level > highestLevel) {
        highestLevel = level
      }

      const rawDate = monster.updatedAt ?? monster.createdAt
      if (rawDate !== undefined) {
        const parsed = new Date(rawDate)
        if (!Number.isNaN(parsed.getTime()) && (latestAdoption === null || parsed > latestAdoption)) {
          latestAdoption = parsed
        }
      }

      const mood = monster.state as string
      if (Object.keys(MOOD_LABELS).includes(mood)) {
        moodCounter[mood] = (moodCounter[mood] ?? 0) + 1
        moodSet.add(mood)
      }
    })

    const favoriteMood = Object.entries(moodCounter)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

    return {
      totalMonsters: monsters.length,
      highestLevel,
      latestAdoption,
      favoriteMood,
      moodVariety: moodSet.size
    }
  }, [monsters])

  return (
    <div className='group relative flex flex-1 flex-col gap-4 rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-lg'>
      <div className='flex items-center gap-4'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-monsters-pink/10 text-lg font-semibold text-pink-flare-600'>
          {userInitial}
        </div>
        <div className='flex-1'>
          <h3 className='font-medium text-slate-900'>{displayName}</h3>
          <p className='text-sm text-slate-500'>{sessionEmail}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='rounded-2xl bg-slate-50 p-4 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:bg-white hover:shadow'>
          <p className='flex items-center gap-2 text-sm font-medium text-slate-900'>
            <span className='text-lg'>🏆</span>
            Niveau le plus élevé
          </p>
          <p className='mt-2 text-2xl font-semibold text-pink-flare-600'>{stats.highestLevel}</p>
        </div>
        <div className='rounded-2xl bg-slate-50 p-4 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:bg-white hover:shadow'>
          <p className='flex items-center gap-2 text-sm font-medium text-slate-900'>
            <span className='text-lg'>🌟</span>
            Total des créatures
          </p>
          <p className='mt-2 text-2xl font-semibold text-pink-flare-600'>{stats.totalMonsters}</p>
        </div>
      </div>
    </div>
  )
}
