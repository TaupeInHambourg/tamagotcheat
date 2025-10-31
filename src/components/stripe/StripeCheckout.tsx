/**
 * Stripe Checkout Component
 *
 * Wrapper for Stripe's Embedded Checkout UI.
 * Handles client-side payment form rendering with Stripe React components.
 *
 * Architecture:
 * - Single Responsibility: Checkout UI rendering only
 * - Dependency Inversion: Depends on Stripe SDK abstractions
 * - Clean Architecture: Presentation layer
 *
 * Security:
 * - Uses public key (safe for client-side)
 * - Session creation happens server-side
 * - Payment processing handled by Stripe
 *
 * @module components/stripe
 */

'use client'

import { useCallback } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createCheckoutSession } from '@/actions/stripe.actions'

// Initialize Stripe with public key (safe for client-side)
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY == null) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set')
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

interface StripeCheckoutProps {
  /** ID of the Koins package to purchase */
  packageId: string
}

/**
 * StripeCheckout - Embedded payment form
 *
 * Renders Stripe's embedded checkout UI for seamless payment experience.
 * Automatically fetches client secret and displays payment form.
 *
 * Flow:
 * 1. Component mounts
 * 2. Fetches client secret from server action
 * 3. Displays Stripe checkout form
 * 4. User completes payment
 * 5. Stripe redirects to success page
 * 6. Webhook credits Koins
 *
 * Design:
 * - Fully responsive
 * - Styled by Stripe (consistent branding)
 * - Handles all payment methods
 * - Built-in error handling
 *
 * @param props - Component props
 * @returns Embedded checkout UI
 *
 * @example
 * ```tsx
 * <StripeCheckout packageId="koins-100" />
 * ```
 */
export function StripeCheckout ({ packageId }: StripeCheckoutProps): React.ReactNode {
  /**
   * Fetch client secret for checkout session
   *
   * Called automatically by EmbeddedCheckoutProvider.
   * Creates session via server action for security.
   *
   * @returns Client secret for embedded checkout
   * @throws Error if session creation fails
   */
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const secret = await createCheckoutSession(packageId)
    if (secret == null) {
      throw new Error('Failed to create checkout session')
    }
    return secret
  }, [packageId])

  return (
    <div
      id='checkout'
      className='w-full min-h-[600px] rounded-2xl'
    >
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret
        }}
      >
        <EmbeddedCheckout className='w-full' />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default StripeCheckout
