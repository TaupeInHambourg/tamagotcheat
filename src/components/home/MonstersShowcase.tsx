import { MonsterCard } from '../monsters'

/**
 * MonstersShowcase - Galerie des monstres
 *
 * Responsabilité unique : Afficher la galerie des créatures disponibles
 */
export default function MonstersShowcase (): React.ReactNode {
  const monsters = [
    {
      name: 'Chat Cosmique',
      level: 1,
      color: 'purple',
      state: 'happy',
      draw: '/assets/tamagocheats/chat-cosmique/happy.svg'
    },
    {
      name: 'Dino Nuage',
      level: 1,
      color: 'blue',
      state: 'happy',
      draw: '/assets/tamagocheats/dino-nuage/happy.svg'
    },
    {
      name: 'Fée Magique',
      level: 1,
      color: 'pink',
      state: 'happy',
      draw: '/assets/tamagocheats/fairy-monster/happy.svg'
    },
    {
      name: 'Grenouille Étoilée',
      level: 1,
      color: 'green',
      state: 'happy',
      draw: '/assets/tamagocheats/grenouille-etoilee/happy.svg'
    }
  ] as const

  return (
    <section id='monsters' className='py-20 lg:py-28 px-6 lg:px-8 bg-gradient-to-br from-moss-light/30 to-autumn-cream'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-bold text-chestnut-deep leading-tight mb-6'>
            Rencontrez vos futurs compagnons 🌟
          </h2>
          <p className='text-xl text-chestnut-medium leading-relaxed max-w-2xl mx-auto'>
            Chaque créature a sa propre personnalité et ses besoins spécifiques
          </p>
        </div>

        <div className='grid md:grid-cols-4 gap-8'>
          {monsters.map((monster) => (
            <div key={monster.name}>
              <MonsterCard monster={monster} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
