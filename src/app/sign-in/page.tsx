import AuthFormContent from '@/components/forms/auth-form-content'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

function SignInPage (): ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-flare-50 to-white flex flex-col items-center justify-center relative overflow-hidden'>
      {/* Back to home button */}
      <Link
        href='/'
        className='absolute top-6 left-6 flex items-center gap-2 text-pink-flare-700 hover:text-pink-flare-900 transition-colors duration-200 font-semibold group'
      >
        <svg
          className='w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
        </svg>
        <span>Retour à l&apos;accueil</span>
      </Link>

      {/* Images de monstres en background */}
      <div className='absolute w-64 h-64 -left-20 top-10 opacity-10'>
        <Image src='/assets/tamagocheats/dino-nuage/sleepy.svg' alt='Monster decoration' fill className='object-contain' />
      </div>
      <div className='absolute w-64 h-64 -right-20 bottom-10 opacity-10'>
        <Image src='/assets/tamagocheats/chat-cosmique/happy.svg' alt='Monster decoration' fill className='object-contain' />
      </div>

      <h1 className='text-4xl font-bold text-pink-flare-900 mb-8'>Tamagotcheat</h1>
      <AuthFormContent />
    </div>
  )
}

export default SignInPage
