import { useState } from 'react'
import InputField from '../Input'
import Button from '../Button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignUpForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: 'poubelle@test.com',
    password: '1234567890'
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    onError('')

    void authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: '',
      callbackURL: '/sign-in'
    }, {
      onRequest: (ctx) => {
        console.log('Signing up...', ctx)
      },
      onSuccess: (ctx) => {
        console.log('User signed up:', ctx)
        setIsLoading(false)
        onError('') // Clear error on success
      },
      onError: (ctx) => {
        console.error('Sign up error:', ctx)
        setIsLoading(false)
        onError(ctx.error.message)
      }
    })
  }

  return (
    <div>
      <h2 className='text-3xl font-bold mb-8 text-pink-flare-900 text-center'>Créer un compte</h2>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <InputField
          type='email'
          name='email'
          label='Email:'
          value={credentials.email}
          onChangeText={(text: string) => setCredentials({ ...credentials, email: text })}
        />
        <InputField
          type='password'
          name='password'
          label='Password:'
          value={credentials.password}
          onChangeText={(text: string) => setCredentials({ ...credentials, password: text })}
        />
        <Button variant='primary' size='md' type='submit'>Sign Up</Button>
      </form>
    </div>
  )
}

export default SignUpForm
