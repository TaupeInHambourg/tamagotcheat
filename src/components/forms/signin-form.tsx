import { useState } from 'react'
import InputField from '../Input'
import Button from '../Button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignInForm (): ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: 'poubelle@test.com',
    password: '1234567890'
  })
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Signing in with', credentials)

    void authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      rememberMe: '',
      callbackURL: '/'
    }, {
      onRequest: (ctx) => console.log('Requesting...', ctx),
      onSuccess: (ctx) => console.log('Success!', ctx),
      onError: (ctx) => console.error('Error:', ctx)
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
        <Button variant='primary' size='md' type='submit'>Sign In</Button>
      </form>
    </div>
  )
}

export default SignInForm
