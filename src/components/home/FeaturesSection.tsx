export default function FeaturesSection (): React.ReactNode {
  return (
    <section id='features' className='py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold text-pink-flare-900 text-center mb-12'>
          Une expérience unique de jeu
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              title: 'Personnalisation complète',
              description: 'Créez un monstre unique qui vous ressemble avec des milliers de combinaisons possibles.'
            },
            {
              title: 'Évolution dynamique',
              description: 'Voyez votre monstre grandir et évoluer selon vos choix et interactions.'
            },
            {
              title: 'Communauté active',
              description: "Partagez vos aventures et connectez-vous avec d'autres dresseurs passionnés."
            }
          ].map((feature, index) => (
            <div key={index} className='bg-pink-flare-50 p-6 rounded-xl'>
              <h3 className='text-xl font-semibold text-pink-flare-800 mb-4'>{feature.title}</h3>
              <p className='text-pink-flare-600'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
