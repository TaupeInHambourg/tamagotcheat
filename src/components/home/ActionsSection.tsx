export default function ActionsSection (): React.ReactNode {
  return (
    <section id='actions' className='py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='text-3xl font-bold text-pink-flare-900 text-center mb-12'>
          Prenez soin de votre compagnon
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[
            {
              title: 'Nourrir',
              description: 'Une alimentation équilibrée pour une croissance saine'
            },
            {
              title: 'Jouer',
              description: 'Développez votre lien à travers des mini-jeux amusants'
            },
            {
              title: 'Éduquer',
              description: 'Apprenez-lui de nouvelles compétences'
            },
            {
              title: 'Soigner',
              description: 'Gardez votre monstre en pleine forme'
            },
            {
              title: 'Décorer',
              description: 'Personnalisez son environnement'
            },
            {
              title: 'Socialiser',
              description: "Rencontrez d'autres monstres"
            }
          ].map((action, index) => (
            <div key={index} className='bg-white p-6 rounded-xl shadow-md border border-pink-flare-100'>
              <h3 className='text-xl font-semibold text-pink-flare-800 mb-4'>{action.title}</h3>
              <p className='text-pink-flare-600'>{action.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
