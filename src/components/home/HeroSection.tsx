import Button from '@/components/Button'
import Image from 'next/image'

export default function HeroSection (): React.ReactNode {
  return (
    <section className='bg-gradient-to-b from-pink-flare-50 to-white pt-32 pb-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8'>
            <h1 className='text-5xl font-bold text-pink-flare-900'>
              Adoptez votre compagnon virtuel
              <span className='text-maroon-oak-600'> unique</span>
            </h1>
            <p className='text-xl text-pink-flare-600'>
              Créez, élevez et choyez votre petit monstre dans un univers magique et coloré. Une expérience attachante qui ravira petits et grands !
            </p>
            <div className='flex gap-4'>
              <Button
                variant='primary'
                size='lg'
              >
                Commencer l&apos;aventure
              </Button>
              <Button
                variant='outline'
                size='lg'
              >
                En savoir plus
              </Button>
            </div>
          </div>
          <div className='relative h-[400px]'>
            <Image
              src='/monster-hero.png'
              alt='Monster hero'
              fill
              className='object-contain'
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
