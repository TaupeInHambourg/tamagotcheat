'use client'

import { useState } from 'react'
import SignInForm from './signin-form'
import SignUpForm from './signup-form'
import Button from '../Button'

function AuthFormContent (): React.ReactNode {
  const [isSignIn, setIsSignIn] = useState<boolean>(true)
  return (
    <div className='w-full max-w-md mx-auto p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-flare-100'>
      {/* Zone d'erreur */}
      <div id='error-container' className='mb-6 hidden'>
        <div className='p-4 bg-maroon-oak-50 border border-maroon-oak-200 rounded-lg'>
          <p className='text-maroon-oak-800 text-sm' />
        </div>
      </div>

      {isSignIn ? <SignInForm /> : <SignUpForm />}

      <div className='mt-6 text-center'>
        <Button
          variant='link'
          size='md'
          type='button'
          onClick={() => setIsSignIn(!isSignIn)}
        >
          {isSignIn ? 'Créer un compte' : "J'ai déjà un compte"}
        </Button>
      </div>
    </div>
  )
}

export default AuthFormContent
