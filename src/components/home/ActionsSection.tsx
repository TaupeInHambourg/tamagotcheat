/**
 * ActionsSection - Section des actions
 *
 * Responsabilité unique : Afficher les actions possibles avec les créatures
 */
export default function ActionsSection (): React.ReactNode {
  return (
    <section id='actions' className='py-12 sm:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 lg:px-8 bg-white/50'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-10 sm:mb-12 lg:mb-16'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-4 sm:mb-6'>
            Prenez soin de votre compagnon 💖
          </h2>
          <p className='text-base sm:text-lg lg:text-xl text-chestnut-medium leading-relaxed'>
            Plein d'activités pour rendre ton monstre heureux
          </p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
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
            <div key={index} className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-autumn-coral/50'>
              <div className='text-4xl sm:text-5xl mb-4 sm:mb-6'>
                {action.icon}
              </div>
              <h3 className='text-xl sm:text-2xl lg:text-3xl font-bold text-chestnut-deep leading-tight mb-3 sm:mb-4'>{action.title}</h3>
              <p className='text-sm sm:text-base text-chestnut-medium leading-relaxed mb-3 sm:mb-4'>{action.description}</p>
              <span
                className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
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
