import { MonsterCard } from '../monsters'

// Single Responsibility: MonstersSection orchestrates the monster gallery
export default function MonstersSection (): React.ReactNode {
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
    <section id='monsters' className='py-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Rencontrez vos futurs compagnons
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Chaque créature a sa propre personnalité et ses besoins spécifiques
          </p>
        </div>

        <div className='grid md:grid-cols-4 gap-6'>
          {monsters.map((monster) => (
            <MonsterCard key={monster.name} monster={monster} />
          ))}
        </div>
      </div>
    </section>
  )
}
