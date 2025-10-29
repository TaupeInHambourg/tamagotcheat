/**
 * FeaturesSection - Section des fonctionnalités
 *
 * Responsabilité unique : Afficher les avantages du jeu
 */
export default function FeaturesSection (): React.ReactNode {
  return (
    <section id='features' className='py-20 lg:py-28 px-6 lg:px-8 bg-white/50'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl sm:text-5xl font-bold text-chestnut-deep leading-tight mb-6'>
            Une expérience unique de jeu ✨
          </h2>
          <p className='text-xl text-chestnut-medium leading-relaxed'>
            Découvre tout ce qui rend ton aventure inoubliable
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10'>
          {[
            {
              icon: '🎨',
              title: 'Personnalisation complète',
              description: 'Créez un monstre unique qui vous ressemble avec des milliers de combinaisons possibles.'
            },
            {
              icon: '📈',
              title: 'Évolution dynamique',
              description: 'Voyez votre monstre grandir et évoluer selon vos choix et interactions.'
            },
            {
              icon: '👥',
              title: 'Communauté active',
              description: "Partagez vos aventures et connectez-vous avec d'autres dresseurs passionnés."
            }
          ].map((feature, index) => (
            <div key={index} className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-autumn-coral/50'>
              <div className='text-5xl mb-6'>{feature.icon}</div>
              <h3 className='text-2xl sm:text-3xl font-bold text-chestnut-deep leading-tight mb-4'>{feature.title}</h3>
              <p className='text-chestnut-medium leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
