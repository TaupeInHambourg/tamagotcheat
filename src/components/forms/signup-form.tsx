import { useState } from 'react'
import InputField from '../Input'
import Button from '../Button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignUpForm (): ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: 'poubelle@test.com',
    password: '1234567890'
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    console.log('Signing up with', credentials)

    const { data, error } = await authClient.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: '',
      callbackURL: '/sign-in'
    }, {
      onRequest: (ctx) => console.log('Requesting...', ctx),
      onSuccess: (ctx) => console.log('Success!', ctx),
      onError: (ctx) => console.error('Error:', ctx)
    })
  }

  return (
    <div>
      <h3>Sign Up</h3>
      <form className='space-y-4' onSubmit={handleSubmit}>
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
