'use client'

import Button from '@/components/Button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import type { ReactNode } from 'react'

export default function Home (): ReactNode {
  return (
    <>
      <Header />
      <div className='min-h-screen'>
        {/* Hero Section */}
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
                    onClick={() => {}}
                  >
                    Commencer l&apos;aventure
                  </Button>
                  <Button
                    variant='outline'
                    size='lg'
                    onClick={() => {}}
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

        {/* Features Section */}
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

        {/* Monsters Showcase */}
        <section id='monsters' className='py-20 bg-gradient-to-b from-white to-pink-flare-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl font-bold text-pink-flare-900 text-center mb-12'>
              Découvrez nos adorables monstres
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
              {[1, 2, 3, 4].map((monster) => (
                <div key={monster} className='relative h-[250px] bg-white rounded-xl shadow-lg overflow-hidden'>
                  <Image
                    src={`/monster-${monster}.png`}
                    alt={`Monster ${monster}`}
                    fill
                    className='object-contain p-4'
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Actions Section */}
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

        {/* Newsletter Section */}
        <section id='newsletter' className='py-20 bg-cape-palliser-50'>
          <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h2 className='text-3xl font-bold text-cape-palliser-900 mb-4'>
              Restez informé
            </h2>
            <p className='text-cape-palliser-600 mb-8'>
              Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre premier achat in-app !
            </p>
            <form className='flex flex-col sm:flex-row gap-4 justify-center'>
              <input
                type='email'
                placeholder='Votre email'
                className='px-4 py-3 rounded-lg border border-cape-palliser-200 focus:outline-none focus:ring-2 focus:ring-cape-palliser-500 flex-grow max-w-md'
              />
              <Button
                variant='primary'
                size='lg'
                onClick={() => {}}
              >
                S&apos;inscrire
              </Button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
