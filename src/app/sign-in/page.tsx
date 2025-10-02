import AuthFormContent from '@/components/forms/auth-form-content'
import Image from 'next/image'
import type { ReactNode } from 'react'

function SignInPage (): ReactNode {
  return (
    <div className='min-h-screen bg-gradient-to-b from-pink-flare-50 to-white flex flex-col items-center justify-center relative overflow-hidden'>
      {/* Images de monstres en background */}
      <div className='absolute w-64 h-64 -left-20 top-10 opacity-10'>
        <Image src='/monster-1.png' alt='Monster decoration' fill className='object-contain' />
      </div>
      <div className='absolute w-64 h-64 -right-20 bottom-10 opacity-10'>
        <Image src='/monster-2.png' alt='Monster decoration' fill className='object-contain' />
      </div>

      <h1 className='text-4xl font-bold text-pink-flare-900 mb-8'>Tamagotcheat</h1>
      <AuthFormContent />
    </div>
  )
}

export default SignInPage
