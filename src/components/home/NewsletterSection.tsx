import Button from '@/components/Button'

/**
 * NewsletterSection - Section newsletter
 *
 * Responsabilité unique : Afficher le formulaire d'inscription newsletter
 */
export default function NewsletterSection (): React.ReactNode {
  return (
    <section id='newsletter' className='py-20 lg:py-28 px-6 lg:px-8 bg-gradient-to-br from-autumn-peach/20 to-moss-light/30'>
      <div className='max-w-3xl mx-auto'>
        <div className='bg-gradient-to-br from-autumn-cream to-autumn-peach/30 rounded-2xl shadow-md border border-autumn-peach p-12 text-center'>
          <div className='mb-6'>
            <span className='text-6xl inline-block'>📮</span>
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-6'>
            Restez informé
          </h2>
          <p className='text-xl text-chestnut-medium leading-relaxed mb-8'>
            Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre premier achat in-app ! ✨
          </p>
          <form className='flex flex-col sm:flex-row gap-4 justify-center items-stretch'>
            <input
              type='email'
              placeholder='Votre email'
              className='w-full px-4 py-3 rounded-xl border-2 border-autumn-peach bg-white/70 backdrop-blur-sm text-chestnut-deep placeholder:text-chestnut-light focus:outline-none focus:border-autumn-coral focus:ring-4 focus:ring-autumn-peach/20 transition-all duration-200 flex-grow max-w-md'
            />
            <Button
              variant='primary'
              size='lg'
            >
              <span className='flex items-center gap-2'>
                <span>S&apos;inscrire</span>
                <span>🚀</span>
              </span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
