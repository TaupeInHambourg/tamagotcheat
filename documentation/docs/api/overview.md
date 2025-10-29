---
sidebar_position: 1
---

# API Overview

Tamagotcheat uses **Next.js Server Actions** for API functionality, following Clean Architecture principles.

## Architecture

```
Client Component
      ↓
Server Action (Actions Layer)
      ↓
Service Layer (Business Logic)
      ↓
Repository Layer (Data Access)
      ↓
Database (MongoDB)
```

### Benefits

- **Type Safety**: Full TypeScript across client and server
- **No API Routes**: Direct function calls from client
- **Automatic Serialization**: No manual JSON parsing
- **Better DX**: Simpler than REST/GraphQL for many use cases

## Server Actions

Located in `src/actions/`, server actions are the entry point for client requests.

### Characteristics

- Marked with `'use server'` directive
- Can only be called from client components
- Automatically handle serialization
- Support form actions and direct calls

### Example

```typescript
'use server'

import { getMonsterService } from '@/services'

export async function getMonsters() {
  // 1. Authenticate user
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' }
  }

  // 2. Call service layer
  const service = getMonsterService()
  const result = await service.getUserMonsters(session.user.id)

  // 3. Return result
  if (!result.success) {
    return { success: false, error: result.error }
  }

  // 4. Revalidate cache if needed
  revalidatePath('/dashboard')

  return { success: true, data: result.data }
}
```

## Available APIs

### Monster Management

- [Monsters API](./monsters) - Create, read, update monsters
- Authentication required
- Owner validation enforced

### Authentication

- [Auth API](./auth) - Sign in, sign up, sign out
- Session management
- Social auth (planned)

## Request/Response Pattern

### Standard Response Format

All actions return consistent response objects:

```typescript
type OperationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }
```

### Client Usage

```tsx
'use client'

import { createMonster } from '@/actions/monsters.actions'
import { useState } from 'react'

export function CreateMonsterForm() {
  const [error, setError] = useState<string>()
  
  async function handleSubmit(formData: FormData) {
    const result = await createMonster(formData)
    
    if (!result.success) {
      setError(result.error)
      return
    }
    
    // Success! result.data contains the new monster
    console.log('Created:', result.data)
  }
  
  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
```

## Error Handling

### Authentication Errors

```typescript
const session = await auth()
if (!session?.user?.id) {
  return {
    success: false,
    error: 'You must be logged in to perform this action'
  }
}
```

### Validation Errors

```typescript
const validation = validateMonsterData(data)
if (!validation.isValid) {
  return {
    success: false,
    error: validation.errors.join(', ')
  }
}
```

### Database Errors

```typescript
try {
  const result = await service.createMonster(data)
  return result
} catch (error) {
  console.error('Unexpected error:', error)
  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.'
  }
}
```

## Cache Management

### Revalidation

Next.js automatically caches server action results. Use `revalidatePath` or `revalidateTag` to invalidate:

```typescript
import { revalidatePath } from 'next/cache'

export async function createMonster(data: CreateMonsterData) {
  const result = await service.createMonster(data)
  
  if (result.success) {
    // Invalidate dashboard cache
    revalidatePath('/dashboard')
    revalidatePath('/my-monsters')
  }
  
  return result
}
```

### Cache Tags

```typescript
import { revalidateTag } from 'next/cache'

// Tag during fetch
fetch(url, {
  next: { tags: ['monsters'] }
})

// Revalidate all monsters
revalidateTag('monsters')
```

## Security

### Authentication Check

Always verify the user session:

```typescript
const session = await auth()
if (!session?.user?.id) {
  return { success: false, error: 'Unauthorized' }
}
```

### Authorization Check

Verify the user owns the resource:

```typescript
const monster = await service.getMonsterById(monsterId, userId)
if (!monster.success) {
  return { success: false, error: 'Monster not found or access denied' }
}
```

### Input Validation

Always validate input data:

```typescript
import { validateMonsterData } from '@/utils/monster-form-validator'

const validation = validateMonsterData(formData)
if (!validation.isValid) {
  return { success: false, error: validation.errors[0] }
}
```

## Rate Limiting

Currently not implemented. Consider adding:

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})

export async function createMonster(data: CreateMonsterData) {
  const { success } = await ratelimit.limit(userId)
  if (!success) {
    return { success: false, error: 'Rate limit exceeded' }
  }
  
  // Continue with action...
}
```

## Testing Server Actions

```typescript
import { createMonster } from './monsters.actions'
import { getMonsterService } from '@/services'

jest.mock('@/services')
jest.mock('@/lib/auth')

describe('createMonster', () => {
  it('creates monster successfully', async () => {
    // Mock auth
    (auth as jest.Mock).mockResolvedValue({
      user: { id: 'user-123' }
    })
    
    // Mock service
    const mockService = {
      createMonster: jest.fn().mockResolvedValue({
        success: true,
        data: { id: 'monster-1', name: 'Test' }
      })
    }
    (getMonsterService as jest.Mock).mockReturnValue(mockService)
    
    // Call action
    const result = await createMonster({
      name: 'Test',
      templateId: 'chat-cosmique'
    })
    
    expect(result.success).toBe(true)
    expect(result.data?.name).toBe('Test')
  })

  it('returns error when not authenticated', async () => {
    (auth as jest.Mock).mockResolvedValue(null)
    
    const result = await createMonster({
      name: 'Test',
      templateId: 'chat-cosmique'
    })
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('authenticated')
  })
})
```

## Best Practices

### ✅ DO
- Always authenticate requests
- Validate all input data
- Use consistent response format
- Handle errors gracefully
- Revalidate cache after mutations
- Log errors for debugging
- Add rate limiting for production

### ❌ DON'T
- Expose sensitive data in error messages
- Skip validation
- Trust client-side data
- Ignore authorization checks
- Return raw database errors to client
- Forget to revalidate cache

## Performance Tips

### Parallel Requests

```typescript
const [monsters, user, stats] = await Promise.all([
  getMonsters(),
  getUserProfile(),
  getUserStats()
])
```

### Streaming

For large datasets, consider streaming:

```typescript
export async function streamMonsters() {
  const encoder = new TextEncoder()
  
  return new ReadableStream({
    async start(controller) {
      const monsters = await service.getAllMonsters()
      
      for (const monster of monsters) {
        controller.enqueue(
          encoder.encode(JSON.stringify(monster) + '\n')
        )
      }
      
      controller.close()
    }
  })
}
```

## Related Documentation

- [Monsters API](./monsters) - Monster management endpoints
- [Auth API](./auth) - Authentication endpoints
- [Service Layer](../architecture/service-layer) - Business logic
- [Repository Pattern](../architecture/database-layer) - Data access
