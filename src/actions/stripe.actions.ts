/**
 * Stripe Server Actions
 *
 * Handles Stripe payment session creation.
 * Server actions for secure payment processing.
 *
 * Architecture:
 * - Single Responsibility: Stripe checkout orchestration
 * - Dependency Inversion: Depends on Stripe abstraction and auth
 * - Clean Architecture: Application layer (use cases)
 *
 * Security:
 * - Server-only execution
 * - User authentication required
 * - Secure metadata handling
 *
 * @module actions
 */

'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { getKoinsPackage } from '@/config/koins.config'

/**
 * Create a Stripe Checkout session for Koins purchase
 *
 * Business rules:
 * - User must be authenticated
 * - Package must exist in catalog
 * - Session created with user metadata for webhook processing
 *
 * Flow:
 * 1. Verify user authentication
 * 2. Validate package exists
 * 3. Create Stripe session with embedded UI
 * 4. Return client secret for frontend display
 *
 * @param packageId - ID of the Koins package to purchase
 * @returns Client secret for Stripe checkout or redirects to login
 *
 * @throws Error if package not found
 */
export async function createCheckoutSession (packageId: string): Promise<string | null> {
  // Authentication check (Dependency Inversion - depends on auth abstraction)
  const headers = await import('next/headers').then(async m => await m.headers())
  const session = await auth.api.getSession({
    headers
  })

  if (session == null || session.user == null) {
    redirect('/sign-in')
  }

  // Validate package exists (Open/Closed - new packages don't require changes here)
  const koinsPackage = getKoinsPackage(packageId)
  if (koinsPackage == null) {
    throw new Error(`Package with id "${packageId}" not found`)
  }

  // Get base URL for redirects
  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'

  try {
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      // Embedded UI mode for seamless integration
      ui_mode: 'embedded',

      // Line items - what the user is purchasing
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: koinsPackage.name,
              description: koinsPackage.description
              // Optional: Add images for better UX
              // images: ['https://yoursite.com/koins-icon.png']
            },
            unit_amount: koinsPackage.priceInCents
          },
          quantity: 1
        }
      ],

      // Payment mode
      mode: 'payment',

      // Metadata for webhook processing
      // This allows us to credit the correct user with Koins
      metadata: {
        userId: session.user.id,
        koins: koinsPackage.koins.toString(),
        packageId: koinsPackage.id
      },

      // Return URL after successful payment
      return_url: `${baseUrl}/wallet/success?session_id={CHECKOUT_SESSION_ID}`
    })

    // Return client secret for embedded checkout
    return checkoutSession.client_secret
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

/**
 * Verify a checkout session status
 *
 * Used on the success page to confirm payment completion.
 * Does NOT credit Koins (that's done by webhook for security).
 *
 * @param sessionId - Stripe session ID from redirect
 * @returns Session status information including Koins from metadata
 */
export async function verifyCheckoutSession (sessionId: string): Promise<{
  success: boolean
  status: string
  customerEmail: string | null
  amountTotal: number | null
  koins: number
} | null> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Extract koins from metadata
    const koins = parseInt(session.metadata?.koins ?? '0', 10)

    return {
      success: session.payment_status === 'paid',
      status: session.payment_status,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total,
      koins
    }
  } catch (error) {
    console.error('Error verifying checkout session:', error)
    return null
  }
}
