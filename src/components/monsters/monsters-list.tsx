import Image from 'next/image'
import {
  DEFAULT_MONSTER_STATE,
  MONSTER_STATES,
  type MonsterState
} from '@/types/monster.types'
import Link from 'next/link'

export interface DashboardMonster {
  id?: string
  ownerId?: string
  name: string
  level?: number | null
  _id?: string
  state?: MonsterState | string | null
  draw?: string
  createdAt?: string
  updatedAt?: string
}

const mergeClasses = (...values: Array<string | undefined>): string => values.filter(Boolean).join(' ')

const MONSTER_STATE_LABELS: Record<MonsterState, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'Fâché',
  hungry: 'Affamé',
  sleepy: 'Somnolent'
}

const STATE_BADGE_CLASSES: Record<MonsterState, string> = {
  happy: 'bg-lochinvar-100 text-lochinvar-700 ring-1 ring-inset ring-lochinvar-200',
  sad: 'bg-fuchsia-blue-100 text-fuchsia-blue-700 ring-1 ring-inset ring-fuchsia-blue-200',
  angry: 'bg-moccaccino-100 text-moccaccino-600 ring-1 ring-inset ring-moccaccino-200',
  hungry: 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200',
  sleepy: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
}

const MONSTER_STATE_EMOJI: Record<MonsterState, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😤',
  hungry: '😋',
  sleepy: '😴'
}

const isMonsterState = (value: MonsterState | string | null | undefined): value is MonsterState => (
  typeof value === 'string' && MONSTER_STATES.includes(value as MonsterState)
)

const formatAdoptionDate = (value: string | undefined): string | null => {
  if (value === undefined) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

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
          const state = isMonsterState(monster.state) ? monster.state : DEFAULT_MONSTER_STATE
          const adoptionDate = formatAdoptionDate(monster.createdAt ?? monster.updatedAt)
          const cardKey = monster.id ?? monster._id ?? monster.name
          const levelLabel = monster.level ?? 1
          const monsterHref = `/creatures/${String(monster.id ?? monster._id ?? '')}`
          const monsterDraw = monster.draw ?? '/placeholder-monster.png'

          return (
            <Link
              key={cardKey}
              href={monsterHref}
              className='block group'
            >
              <article className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-autumn-coral/50'>
                <div className='relative flex flex-col gap-6'>
                  <div className='relative flex items-center justify-center overflow-hidden rounded-2xl bg-autumn-cream/50 p-6 border border-autumn-peach/30'>
                    <Image
                      src={monsterDraw}
                      alt={monster.name}
                      width={200}
                      height={200}
                      className='transition-transform duration-300 group-hover:scale-110'
                    />
                    <span
                      className={`absolute right-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${STATE_BADGE_CLASSES[state]}`}
                    >
                      <span aria-hidden='true'>{MONSTER_STATE_EMOJI[state]}</span>
                      {MONSTER_STATE_LABELS[state]}
                    </span>
                  </div>

                  <div className='flex flex-1 flex-col gap-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='space-y-2'>
                        <h3 className='text-xl font-bold text-chestnut-deep'>{monster.name}</h3>
                        {adoptionDate !== null && (
                          <p className='text-sm text-chestnut-medium'>Arrivé le {adoptionDate}</p>
                        )}
                      </div>
                      <span className='inline-flex items-center gap-1 rounded-full bg-autumn-peach px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-autumn-brown'>
                        <span aria-hidden='true'>⭐</span>
                        Niv {levelLabel}
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-2 text-xs'>
                      <span className='inline-flex items-center gap-1 rounded-full bg-moss-pastel px-3 py-1.5 font-semibold text-moss-deep'>
                        <span aria-hidden='true'>🎨</span>
                        Pixel art
                      </span>
                      <span className='inline-flex items-center gap-1 rounded-full bg-maple-light px-3 py-1.5 font-semibold text-maple-deep'>
                        <span aria-hidden='true'>{MONSTER_STATE_EMOJI[state]}</span>
                        {MONSTER_STATE_LABELS[state]}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default MonstersList
