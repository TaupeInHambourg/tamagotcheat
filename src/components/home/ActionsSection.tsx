/**
 * ActionsSection - Section des actions
 *
 * Responsabilité unique : Afficher les actions possibles avec les créatures
 */
export default function ActionsSection (): React.ReactNode {
  return (
    <section id='actions' className='py-20 lg:py-28 px-6 lg:px-8 bg-white/50'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-6'>
            Prenez soin de votre compagnon 💖
          </h2>
          <p className='text-xl text-chestnut-medium leading-relaxed'>
            Plein d'activités pour rendre ton monstre heureux
          </p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[
            {
              icon: '🍎',
              title: 'Nourrir',
              description: 'Une alimentation équilibrée pour une croissance saine',
              color: 'autumn'
            },
            {
              icon: '🎮',
              title: 'Jouer',
              description: 'Développez votre lien à travers des mini-jeux amusants',
              color: 'moss'
            },
            {
              icon: '📚',
              title: 'Éduquer',
              description: 'Apprenez-lui de nouvelles compétences',
              color: 'maple'
            },
            {
              icon: '💊',
              title: 'Soigner',
              description: 'Gardez votre monstre en pleine forme',
              color: 'autumn'
            },
            {
              icon: '🎨',
              title: 'Décorer',
              description: 'Personnalisez son environnement',
              color: 'moss'
            },
            {
              icon: '👋',
              title: 'Socialiser',
              description: "Rencontrez d'autres monstres",
              color: 'maple'
            }
          ].map((action, index) => (
            <div key={index} className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-autumn-coral/50'>
              <div className='text-5xl mb-6'>
                {action.icon}
              </div>
              <h3 className='text-2xl sm:text-3xl font-bold text-chestnut-deep leading-tight mb-4'>{action.title}</h3>
              <p className='text-chestnut-medium leading-relaxed mb-4'>{action.description}</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  action.color === 'autumn'
                    ? 'bg-autumn-peach text-autumn-brown'
                    : action.color === 'moss'
                      ? 'bg-moss-pastel text-moss-deep'
                      : 'bg-maple-light text-maple-deep'
                }`}
              >
                ✨ Découvrir
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
