/**
 * Monster API Route - Get Single Monster
 *
 * This endpoint retrieves a single monster by ID with LAZY STATE DECAY applied.
 *
 * Architecture:
 * Client (useMonsterPolling) → API Route → Server Action → Service → Repository
 *                                                              ↓
 *                                                    computeCurrentState()
 *                                                              ↓
 *                                                    Update DB if changed
 *
 * Key Features:
 * - Automatic state computation on every read
 * - Always returns up-to-date monster data
 * - Database updated only when state actually changes
 *
 * Used by:
 * - useMonsterPolling hook (client-side polling)
 * - Monster detail pages
 * - Monster cards/lists with auto-refresh
 *
 * @endpoint GET /api/monsters/[id]
 * @param {string} id - Monster ID (from URL params)
 * @returns {Monster} Monster object with current state
 * @returns {400} If monster ID is missing or invalid
 * @returns {404} If monster not found
 * @returns {500} If server error occurs
 */

import { NextRequest, NextResponse } from 'next/server'
import { getMonsterById } from '@/actions/monsters.actions'

// Force dynamic rendering - no static optimization
// This ensures we always compute fresh state on each request
export const dynamic = 'force-dynamic'

/**
 * GET handler - Retrieve a single monster with lazy state computation
 *
 * Flow:
 * 1. Extract and validate monster ID from params
 * 2. Call getMonsterById server action
 * 3. Server action calls MonsterService.getMonsterById
 * 4. Service applies computeCurrentState() (lazy decay)
 * 5. If state changed, updates database
 * 6. Returns up-to-date monster to client
 */
export async function GET (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Step 1: Extract monster ID from URL params
    const { id } = await context.params

    // Step 2: Validate ID
    if (id == null || id.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Monster ID is required' },
        { status: 400 }
      )
    }

    // Step 3: Fetch monster via server action
    // This automatically applies lazy state decay computation
    const monster = await getMonsterById(id)

    // Step 4: Handle not found
    if (monster == null) {
      return NextResponse.json(
        { success: false, error: 'Monster not found' },
        { status: 404 }
      )
    }

    // Step 5: Return up-to-date monster
    return NextResponse.json(monster)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    console.error('[API] Error fetching monster:', errorMessage)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
