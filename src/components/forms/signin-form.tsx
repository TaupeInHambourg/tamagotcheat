import { useState } from 'react'
import InputField from '../Input'
import Button from '../Button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignInForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: 'poubelle@test.com',
    password: '1234567890'
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsLoading(true)
    onError('') // Clear previous errors

    void authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      callbackURL: '/dashboard'
    }, {
      onRequest: (ctx) => {
        console.log('Signing in...', ctx)
      },
      onSuccess: (ctx) => {
        console.log('User signed in:', ctx)
        setIsLoading(false)
      },
      onError: (ctx) => {
        console.error('Sign in error:', ctx)
        setIsLoading(false)
        onError(ctx.error.message)
      }
    })
  }

  return (
    <div>
      <h2 className='text-3xl font-bold mb-8 text-pink-flare-900 text-center'>Se connecter</h2>
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
        <Button
          variant='primary'
          size='md'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  )
}

export default SignInForm
