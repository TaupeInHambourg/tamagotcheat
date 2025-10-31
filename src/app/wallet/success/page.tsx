import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getUserKoins } from '@/db/models/user.model'
import { verifyCheckoutSession } from '@/actions/stripe.actions'

/**
 * Payment Success Page Component
 *
 * Displays payment confirmation and credited Koins.
 * Verifies checkout session before showing success message.
 *
 * @architecture Presentation Layer
 * @auth Required - redirects to /sign-in if not authenticated
 */
export default async function SuccessPage ({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>
}): Promise<React.JSX.Element> {
  // Verify authentication
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(async (mod) => await mod.headers())
  })

  if (session == null) {
    redirect('/sign-in')
  }

  // Get session ID from query params
  const params = await searchParams
  const sessionId = params.session_id

  if (sessionId == null) {
    redirect('/wallet')
  }

  // Verify checkout session
  const verification = await verifyCheckoutSession(sessionId)
  if (verification == null || !verification.success) {
    redirect('/wallet')
  }

  // Get updated Koins balance
  const currentKoins = await getUserKoins(session.user.id)

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-flare-50 to-pink-flare-100 py-8 px-4'>
      <div className='container mx-auto max-w-2xl'>
        {/* Success animation container */}
        <div className='text-center mb-8'>
          <div className='inline-block animate-bounce'>
            <div className='text-8xl mb-4'>🎉</div>
          </div>
          <h1 className='text-4xl font-bold text-pink-flare-800 mb-2'>
            Payment Successful!
          </h1>
          <p className='text-lg text-pink-flare-600'>
            Your Koins have been credited to your account
          </p>
        </div>

        {/* Transaction summary */}
        <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6'>
          <div className='space-y-6'>
            {/* Koins credited */}
            <div className='text-center'>
              <div className='text-sm text-pink-flare-600 mb-2'>
                Koins Credited
              </div>
              <div className='text-5xl font-bold text-pink-flare-700'>
                +{verification.koins}
              </div>
            </div>

            {/* Divider */}
            <div className='border-t border-pink-flare-200' />

            {/* Current balance */}
            <div className='text-center'>
              <div className='text-sm text-pink-flare-600 mb-2'>
                Current Balance
              </div>
              <div className='inline-flex items-center gap-2 bg-gradient-to-r from-pink-flare-100 to-pink-flare-200 rounded-full px-6 py-3'>
                <span className='text-3xl'>💰</span>
                <span className='text-3xl font-bold text-pink-flare-700'>
                  {currentKoins}
                </span>
                <span className='text-lg text-pink-flare-600'>Koins</span>
              </div>
            </div>

            {/* Transaction ID */}
            <div className='text-center'>
              <div className='text-xs text-pink-flare-500'>
                Transaction ID: {sessionId.substring(0, 24)}...
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Link
            href='/shop'
            className='block text-center bg-gradient-to-r from-pink-flare-500 to-pink-flare-600 hover:from-pink-flare-600 hover:to-pink-flare-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95'
          >
            🛍️ Go Shopping
          </Link>
          <Link
            href='/creatures'
            className='block text-center bg-white hover:bg-pink-flare-50 text-pink-flare-700 font-semibold py-3 px-6 rounded-xl border-2 border-pink-flare-300 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95'
          >
            🐾 My Monsters
          </Link>
        </div>

        {/* Thank you message */}
        <div className='mt-8 text-center'>
          <p className='text-pink-flare-600'>
            Thank you for your purchase! 💖
          </p>
          <p className='text-sm text-pink-flare-500 mt-2'>
            Use your Koins to buy adorable accessories for your monsters
          </p>
        </div>
      </div>
    </div>
  )
}
