import { MonsterCard } from '../monsters'
import { type Monster } from '@/types/monster.types'

/**
 * MonstersShowcase - Galerie des monstres
 *
 * Responsabilité unique : Afficher la galerie des créatures disponibles
 */
export default function MonstersShowcase (): React.ReactNode {
  const monsters: Monster[] = [
    {
      name: 'Chat Cosmique',
      level: 1,
      state: 'happy',
      draw: '/assets/tamagocheats/chat-cosmique/happy.svg',
      folderPath: 'chat-cosmique',
      colorRange: ['#FF69B4', '#87CEEB'],
      defaultColor: '#FF69B4'
    },
    {
      name: 'Dino Nuage',
      level: 1,
      state: 'happy',
      draw: '/assets/tamagocheats/dino-nuage/happy.svg',
      folderPath: 'dino-nuage',
      colorRange: ['#87CEEB', '#98FB98'],
      defaultColor: '#87CEEB'
    },
    {
      name: 'Fée Magique',
      level: 1,
      state: 'happy',
      draw: '/assets/tamagocheats/fairy-monster/happy.svg',
      folderPath: 'fairy-monster',
      colorRange: ['#FF69B4', '#FFD700'],
      defaultColor: '#FF69B4'
    },
    {
      name: 'Grenouille Étoilée',
      level: 1,
      state: 'happy',
      draw: '/assets/tamagocheats/grenouille-etoilee/happy.svg',
      folderPath: 'grenouille-etoilee',
      colorRange: ['#98FB98', '#FFD700'],
      defaultColor: '#98FB98'
    }
  ]

  return (
    <section id='monsters' className='py-12 sm:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-moss-light/30 to-autumn-cream'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-10 sm:mb-12 lg:mb-16'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-chestnut-deep leading-tight mb-4 sm:mb-6'>
            Rencontrez vos futurs compagnons 🌟
          </h2>
          <p className='text-base sm:text-lg lg:text-xl text-chestnut-medium leading-relaxed max-w-2xl mx-auto'>
            Chaque créature a sa propre personnalité et ses besoins spécifiques
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 auto-rows-fr'>
          {monsters.map((monster) => (
            <div key={monster.name} className='flex w-full'>
              <MonsterCard initialMonster={monster} autoRefresh={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
