'use client'

import { useState } from 'react'
import SignInForm from './signin-form'
import SignUpForm from './signup-form'
import Button from '../Button'

function AuthFormContent (): React.ReactNode {
  const [isSignIn, setIsSignIn] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  return (
    <div className='w-full max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-flare-100'>
      {/* Zone d'erreur */}
      <div id='error-container' className='mb-6 hidden'>
        <div className='p-4 bg-maroon-oak-50 border border-maroon-oak-200 rounded-lg'>
          <p className='text-maroon-oak-800 text-sm' />
        </div>
      </div>

      <div className='transition-all duration-300 ease-in-out'>
        {isSignIn
          ? (
            <div className='animate-in fade-in duration-300'>
              <SignInForm onError={setError} />
            </div>
            )
          : (
            <div className='animate-in fade-in duration-300'>
              <SignUpForm onError={setError} />
            </div>
            )}
      </div>

      <div className='mt-6 text-center'>
        <Button
          variant='link'
          size='md'
          type='button'
          onClick={() => {
            setError('')
            setIsSignIn(!isSignIn)
          }}
        >
          {isSignIn ? 'Créer un compte' : "J'ai déjà un compte"}
        </Button>
      </div>
    </div>
  )
}

export default AuthFormContent
