'use client'

import SignUpForm from './signup-form'

function AuthFormContent (): React.ReactNode {
  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-pink-flare-900 text-center'>Créer un compte</h2>
      <SignUpForm />
    </div>
  )
}

export default AuthFormContent
