import Button from '@/components/Button'
import Image from 'next/image'

/**
 * HeroSection - Section héros de la landing page
 *
 * Responsabilité unique : Afficher la section d'accueil principale
 */
export default function HeroSection (): React.ReactNode {
  return (
    <section className='py-20 lg:py-28 px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          <div className='space-y-8'>
            <div>
              <span className='inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-autumn-peach text-autumn-brown mb-6'>
                🍂 Nouvelle aventure
              </span>
              <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-chestnut-deep leading-tight mb-6'>
                Adoptez votre compagnon virtuel
                <span className='bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent block mt-2'> unique et adorable</span>
              </h1>
            </div>
            <p className='text-xl lg:text-2xl text-chestnut-medium leading-relaxed'>
              Créez, élevez et choyez votre petit monstre dans un univers magique et coloré.
              Une expérience cosy qui ravira petits et grands ! ✨
            </p>
            <div className='flex gap-4 flex-wrap pt-4'>
              <Button
                variant='primary'
                size='lg'
              >
                <span className='flex items-center gap-2'>
                  <span>Commencer l'aventure</span>
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
          <div className='relative h-[400px] lg:h-[500px]'>
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
