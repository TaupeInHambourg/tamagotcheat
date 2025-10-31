import Button from '@/components/Button'
import Image from 'next/image'

/**
 * HeroSection - Section héros de la landing page
 *
 * Responsabilité unique : Afficher la section d'accueil principale
 */
export default function HeroSection (): React.ReactNode {
  return (
    <section className='py-12 sm:py-16 lg:py-20 xl:py-28 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center'>
          <div className='space-y-6 sm:space-y-8'>
            <div>
              <span className='inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-autumn-peach text-autumn-brown mb-4 sm:mb-6'>
                🍂 Nouvelle aventure
              </span>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-chestnut-deep leading-tight mb-4 sm:mb-6'>
                Adoptez votre compagnon virtuel
                <span className='bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent block mt-2'> unique et adorable</span>
              </h1>
            </div>
            <p className='text-base sm:text-lg lg:text-xl xl:text-2xl text-chestnut-medium leading-relaxed'>
              Créez, élevez et choyez votre petit monstre dans un univers magique et coloré.
              Une expérience cosy qui ravira petits et grands ! ✨
            </p>
            <div className='flex gap-3 sm:gap-4 flex-wrap pt-2 sm:pt-4'>
              <Button
                variant='primary'
                size='lg'
              >
                <span className='flex items-center gap-2'>
                  <span className='hidden sm:inline'>Commencer l'aventure</span>
                  <span className='sm:hidden'>Commencer</span>
                  <span>🎮</span>
                </span>
              </Button>
              <Button
                variant='outline'
                size='lg'
              >
                <span className='flex items-center gap-2'>
                  <span>En savoir plus</span>
                  <span>📖</span>
                </span>
              </Button>
            </div>
          </div>
          <div className='relative h-[300px] sm:h-[350px] lg:h-[450px] xl:h-[500px]'>
            <div className='absolute inset-0 bg-gradient-to-br from-autumn-coral/20 to-moss-soft/20 rounded-3xl blur-3xl' />
            <Image
              src='/monster-hero.png'
              alt='Monster hero'
              fill
              className='object-contain relative z-10 drop-shadow-2xl'
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
