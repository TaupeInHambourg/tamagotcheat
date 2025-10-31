import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getKoinsPackage } from '@/config/koins.config'
import { StripeCheckout } from '@/components/stripe/StripeCheckout'

/**
 * Checkout Page Component
 *
 * Renders Stripe embedded checkout for selected package.
 * Handles authentication and package validation.
 *
 * @architecture Presentation Layer
 * @auth Required - redirects to /sign-in if not authenticated
 */
export default async function CheckoutPage ({
  searchParams
}: {
  searchParams: Promise<{ package?: string }>
}): Promise<React.JSX.Element> {
  // Verify authentication
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(async (mod) => await mod.headers())
  })

  if (session == null) {
    redirect('/sign-in')
  }

  // Get package ID from query params
  const params = await searchParams
  const packageId = params.package

  if (packageId == null) {
    redirect('/wallet')
  }

  // Validate package exists
  const pkg = getKoinsPackage(packageId)
  if (pkg == null) {
    redirect('/wallet')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-flare-50 to-pink-flare-100 py-8 px-4'>
      <div className='container mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-pink-flare-800 mb-2'>
            Complete Your Purchase
          </h1>
          <p className='text-pink-flare-600'>
            You&apos;re buying {pkg.koins} Koins for {(pkg.priceInCents / 100).toFixed(2)} €
          </p>
        </div>

        {/* Stripe embedded checkout */}
        <div className='bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6'>
          <StripeCheckout packageId={packageId} />
        </div>

        {/* Security notice */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-pink-flare-600'>
            🔒 Secure payment powered by Stripe
          </p>
          <p className='text-xs text-pink-flare-500 mt-2'>
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  )
}
