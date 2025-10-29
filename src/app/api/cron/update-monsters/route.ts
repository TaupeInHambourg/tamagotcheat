/**
 * Cron API Route - Automated Monster State Updates
 *
 * This endpoint handles periodic monster state updates.
 * Can be called by:
 * - Frontend client (via useAutoUpdateMonsters hook)
 * - External cron services (with proper authentication)
 * - Manual testing/debugging
 *
 * Security:
 * - Requires CRON_SECRET_TOKEN for authentication
 * - Rate limiting recommended in production
 *
 * @endpoint POST /api/cron/update-monsters
 */

import { NextRequest, NextResponse } from 'next/server'
import { createMonsterCronService } from '@/services'

/**
 * Force dynamic rendering (disable static optimization)
 * Ensures fresh data on every request
 */
export const dynamic = 'force-dynamic'

/**
 * Maximum execution time for serverless functions
 */
export const maxDuration = 60

/**
 * Logger with timestamp for better debugging
 * @param level - Log level
 * @param message - Log message
 * @param data - Optional structured data
 */
function log (level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [CRON]`

  if (data != null) {
    console[level](`${prefix} ${message}`, data)
  } else {
    console[level](`${prefix} ${message}`)
  }
}

/**
 * Validates the cron secret token
 * @param request - The incoming request
 * @returns true if valid, false otherwise
 */
function validateCronToken (request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET_TOKEN

  // Skip validation in development if no token is set
  if (process.env.NODE_ENV === 'development' && cronSecret == null) {
    log('warn', '⚠️ CRON_SECRET_TOKEN not set - skipping validation in development')
    return true
  }

  const authHeader = request.headers.get('authorization')
  const providedToken = authHeader?.replace('Bearer ', '')

  return providedToken === cronSecret
}

/**
 * POST handler for cron updates
 * Supports optional userId query parameter for user-specific updates
 */
export async function POST (request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  try {
    // 1. Security: Validate cron token
    if (!validateCronToken(request)) {
      log('warn', '🔒 Unauthorized cron request')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse optional query parameters
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const batchSizeParam = searchParams.get('batchSize')
    const batchSize = batchSizeParam != null ? parseInt(batchSizeParam, 10) : undefined

    log('info', `🔄 Starting cron update${userId != null ? ` for user ${userId}` : ' (all monsters)'}`)

    // 3. Initialize service
    const cronService = createMonsterCronService()

    // 4. Execute update
    const result = userId != null
      ? await cronService.updateForUser(userId, { batchSize })
      : await cronService.updateAll({ batchSize })

    // 5. Handle result
    if (!result.success) {
      log('error', '❌ Cron update failed', { error: result.error })
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    const duration = Date.now() - startTime

    log('info', '✅ Cron update completed', {
      updated: result.data.updated,
      duration: `${duration}ms`
    })

    // 6. Return success response
    return NextResponse.json({
      success: true,
      updated: result.data.updated,
      duration,
      timestamp: result.data.timestamp
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    log('error', '💥 Unexpected error during cron update', {
      error: errorMessage,
      duration: `${duration}ms`
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        duration
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler - same as POST for convenience
 * Some cron services only support GET requests
 */
export async function GET (request: NextRequest): Promise<NextResponse> {
  return await POST(request)
}
