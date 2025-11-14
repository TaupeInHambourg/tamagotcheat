import ActionsCarousel from './ActionsCarousel'

/**
 * ActionsSection - Section des actions
 *
 * Responsabilité unique : Afficher les actions possibles avec les créatures
 * Utilise un carousel sur mobile/tablette et une grille sur desktop
 */
export default function ActionsSection (): React.ReactNode {
  const actions = [
    {
      icon: '🍪',
      title: 'Nourrir',
      description: 'Donne-lui des friandises pour le garder en forme',
      xp: 15,
      color: 'autumn' as const
    },
    {
      icon: '💤',
      title: 'Mettre au lit',
      description: 'Un bon sommeil pour recharger les batteries',
      xp: 5,
      color: 'moss' as const
    },
    {
      icon: '🤗',
      title: 'Consoler',
      description: 'Réconforte-le quand il est triste',
      xp: 10,
      color: 'maple' as const
    },
    {
      icon: '👂',
      title: 'Écouter',
      description: 'Sois attentif à ses besoins',
      xp: 10,
      color: 'autumn' as const
    },
    {
      icon: '🎮',
      title: 'Jouer',
      description: 'Amuse-toi avec lui grâce à des mini-jeux',
      xp: 25,
      color: 'moss' as const
    },
    {
      icon: '🎁',
      title: 'Cadeau',
      description: 'Offre-lui un cadeau spécial pour booster son XP',
      xp: 50,
      color: 'maple' as const
    }
  ]

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

        {/* Carousel for mobile/tablet */}
        <ActionsCarousel actions={actions} />

        {/* Grid for desktop */}
        <div className='hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {[
            {
              icon: '🍪',
              title: 'Nourrir',
              description: 'Donne-lui des friandises pour le garder en forme',
              xp: 15,
              color: 'autumn'
            },
            {
              icon: '💤',
              title: 'Mettre au lit',
              description: 'Un bon sommeil pour recharger les batteries',
              xp: 5,
              color: 'moss'
            },
            {
              icon: '🤗',
              title: 'Consoler',
              description: 'Réconforte-le quand il est triste',
              xp: 10,
              color: 'maple'
            },
            {
              icon: '👂',
              title: 'Écouter',
              description: 'Sois attentif à ses besoins',
              xp: 10,
              color: 'autumn'
            },
            {
              icon: '🎮',
              title: 'Jouer',
              description: 'Amuse-toi avec lui grâce à des mini-jeux',
              xp: 25,
              color: 'moss'
            },
            {
              icon: '🎁',
              title: 'Cadeau',
              description: 'Offre-lui un cadeau spécial pour booster son XP',
              xp: 50,
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
                +{action.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
