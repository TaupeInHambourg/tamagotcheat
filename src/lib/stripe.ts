/**
 * Stripe Server Library
 *
 * Initializes and exports the Stripe server client.
 * Used for creating checkout sessions and handling webhooks.
 *
 * Security:
 * - Server-only import prevents client-side exposure
 * - Secret key never sent to client
 *
 * Architecture:
 * - Single Responsibility: Stripe client initialization only
 * - Dependency Inversion: Other modules depend on this abstraction
 *
 * @module lib
 */

import 'server-only'
import Stripe from 'stripe'

if (process.env.STRIPE_SECRET_KEY == null) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set')
}

/**
 * Stripe server client instance
 *
 * Configured with:
 * - API version: Latest stable
 * - TypeScript support enabled
 * - Server-side only usage
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true
})
