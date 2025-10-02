import AuthFormContent from '@/components/forms/auth-form-content'

function SignInPage (): ReactNode {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center'>
      <h1>Sign In</h1>
      <AuthFormContent />
    </div>
  )
}

export default SignInPage
