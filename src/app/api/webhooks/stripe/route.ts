/**
 * Stripe Webhook Handler
 *
 * Securely processes Stripe webhook events to credit Koins after successful payment.
 * This is the ONLY secure way to credit Koins - never trust client-side confirmation.
 *
 * Architecture:
 * - Single Responsibility: Webhook event processing only
 * - Dependency Inversion: Depends on Stripe and database abstractions
 * - Clean Architecture: Infrastructure layer (external service integration)
 *
 * Security:
 * - Webhook signature verification (prevents fake events)
 * - Idempotency (prevents double-crediting)
 * - Server-side only execution
 *
 * Setup Required:
 * 1. Configure webhook endpoint in Stripe Dashboard
 * 2. Set STRIPE_WEBHOOK_SECRET in environment variables
 * 3. Listen for 'checkout.session.completed' events
 *
 * @module api/webhooks/stripe
 */

import { type NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { addKoins } from '@/db/models/user.model'
import type Stripe from 'stripe'

/**
 * POST handler for Stripe webhooks
 *
 * Flow:
 * 1. Verify webhook signature (security)
 * 2. Parse event type
 * 3. If checkout completed, credit Koins
 * 4. Return 200 OK to Stripe
 *
 * @param req - Next.js request object
 * @returns Response indicating success or error
 */
export async function POST (req: NextRequest): Promise<NextResponse> {
  // Get raw body for signature verification
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (signature == null) {
    console.error('[Stripe Webhook] No signature provided')
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  // Verify webhook secret is configured
  if (process.env.STRIPE_WEBHOOK_SECRET == null) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify signature to ensure event came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    const error = err as Error
    console.error('[Stripe Webhook] Signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Extract metadata from session
    const userId = session.metadata?.userId
    const koins = Number.parseInt(session.metadata?.koins ?? '0')
    const packageId = session.metadata?.packageId

    console.log('[Stripe Webhook] Payment successful:', {
      sessionId: session.id,
      userId,
      koins,
      packageId,
      paymentStatus: session.payment_status
    })

    // Validate metadata
    if (userId == null || userId === '') {
      console.error('[Stripe Webhook] Missing userId in session metadata')
      return NextResponse.json(
        { error: 'Missing user ID in metadata' },
        { status: 400 }
      )
    }

    if (koins <= 0 || Number.isNaN(koins)) {
      console.error('[Stripe Webhook] Invalid koins amount in metadata:', session.metadata?.koins)
      return NextResponse.json(
        { error: 'Invalid koins amount in metadata' },
        { status: 400 }
      )
    }

    // Credit Koins to user (Dependency Inversion - depends on database abstraction)
    try {
      const result = await addKoins(userId, koins)

      if (!result.success) {
        console.error('[Stripe Webhook] Failed to credit koins:', result.error)
        return NextResponse.json(
          { error: 'Failed to credit koins' },
          { status: 500 }
        )
      }

      console.log('[Stripe Webhook] Successfully credited', koins, 'koins to user', userId)
      console.log('[Stripe Webhook] New balance:', result.newBalance)

      // Return success to Stripe
      return NextResponse.json({
        received: true,
        credited: koins,
        userId,
        newBalance: result.newBalance
      })
    } catch (error) {
      console.error('[Stripe Webhook] Error processing payment:', error)
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      )
    }
  }

  // For other event types, just acknowledge receipt
  console.log('[Stripe Webhook] Received event type:', event.type)
  return NextResponse.json({ received: true })
}
