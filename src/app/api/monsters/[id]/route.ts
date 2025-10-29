/**
 * Monster API Route - Get Single Monster
 *
 * Retrieves a single monster by ID with lazy state decay applied.
 * Used for auto-refresh to detect state changes.
 *
 * @endpoint GET /api/monsters/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { getMonsterById } from '@/actions/monsters.actions'

export const dynamic = 'force-dynamic'

/**
 * GET handler - Retrieve a single monster
 */
export async function GET (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    if (id == null || id.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Monster ID is required' },
        { status: 400 }
      )
    }

    // Fetch monster via server action
    const monster = await getMonsterById(id)

    if (monster == null) {
      return NextResponse.json(
        { success: false, error: 'Monster not found' },
        { status: 404 }
      )
    }

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
