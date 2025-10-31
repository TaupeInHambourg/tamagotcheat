---
sidebar_position: 2
---

# Monsters API

API for managing virtual pet monsters in Tamagotcheat.

## Overview

The Monsters API provides operations for creating, reading, and updating monster entities. All operations require authentication and enforce owner-based access control.

**Base Actions**: `src/actions/monsters.actions.ts`

## Operations

### Create Monster

Creates a new monster for the authenticated user.

```typescript
createMonster(data: CreateMonsterData): Promise<OperationResult<IMonster>>
```

#### Parameters

```typescript
interface CreateMonsterData {
  name: string           // Monster name (required)
  templateId: string     // Template ID (required)
  color: string          // Primary color (optional)
  description?: string   // Description (optional)
}
```

#### Example Usage

```tsx
'use client'

import { createMonster } from '@/actions/monsters.actions'

async function handleCreateMonster() {
  const result = await createMonster({
    name: 'Fluffy',
    templateId: 'chat-cosmique',
    color: '#bce5c3'
  })
  
  if (!result.success) {
    console.error('Error:', result.error)
    return
  }
  
  console.log('Created monster:', result.data)
  // result.data is IMonster
}
```

#### Validation Rules

- **name**: 1-50 characters, required
- **templateId**: Must be valid template (chat-cosmique, dino-nuage, fairy-monster, grenouille-etoilee)
- **color**: Valid hex color format (#RRGGBB)
- **description**: Max 500 characters

#### Response

```typescript
{
  success: true,
  data: {
    id: 'monster-uuid',
    name: 'Fluffy',
    templateId: 'chat-cosmique',
    color: '#bce5c3',
    ownerId: 'user-uuid',
    state: {
      happiness: 80,
      hunger: 50,
      energy: 70,
      health: 100
    },
    createdAt: Date,
    updatedAt: Date
  }
}
```

#### Errors

- `401`: "You must be logged in to create a monster"
- `400`: "Invalid monster data: \{validation errors\}"
- `500`: "Failed to create monster. Please try again."

---

### Get User Monsters

Retrieves all monsters owned by the authenticated user.

```typescript
getMonsters(): Promise<OperationResult<IMonster[]>>
```

#### Example Usage

```tsx
'use client'

import { getMonsters } from '@/actions/monsters.actions'
import { useEffect, useState } from 'react'

export function MonsterList() {
  const [monsters, setMonsters] = useState<IMonster[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMonsters() {
      const result = await getMonsters()
      
      if (result.success) {
        setMonsters(result.data)
      }
      
      setLoading(false)
    }
    
    loadMonsters()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {monsters.map(monster => (
        <div key={monster.id}>
          <h3>{monster.name}</h3>
          <p>Happiness: {monster.state.happiness}</p>
        </div>
      ))}
    </div>
  )
}
```

#### Response

```typescript
{
  success: true,
  data: [
    {
      id: 'monster-1',
      name: 'Fluffy',
      templateId: 'chat-cosmique',
      ownerId: 'user-uuid',
      state: { happiness: 80, hunger: 50, energy: 70, health: 100 },
      createdAt: Date,
      updatedAt: Date
    },
    // ... more monsters
  ]
}
```

#### Errors

- `401`: "You must be logged in"
- `500`: "Failed to fetch monsters"

---

### Get Monster by ID

Retrieves a specific monster by ID, with owner validation.

```typescript
getMonsterById(id: string): Promise<OperationResult<IMonster>>
```

#### Parameters

- `id` (string): Monster ID

#### Example Usage

```tsx
'use client'

import { getMonsterById } from '@/actions/monsters.actions'
import { useEffect, useState } from 'react'

export function MonsterDetail({ monsterId }: { monsterId: string }) {
  const [monster, setMonster] = useState<IMonster | null>(null)

  useEffect(() => {
    async function loadMonster() {
      const result = await getMonsterById(monsterId)
      
      if (result.success) {
        setMonster(result.data)
      } else {
        console.error(result.error)
      }
    }
    
    loadMonster()
  }, [monsterId])

  if (!monster) return <p>Loading...</p>

  return (
    <div>
      <h1>{monster.name}</h1>
      <p>Template: {monster.templateId}</p>
      <div>
        <p>Happiness: {monster.state.happiness}</p>
        <p>Hunger: {monster.state.hunger}</p>
        <p>Energy: {monster.state.energy}</p>
        <p>Health: {monster.state.health}</p>
      </div>
    </div>
  )
}
```

#### Response

```typescript
{
  success: true,
  data: {
    id: 'monster-uuid',
    name: 'Fluffy',
    templateId: 'chat-cosmique',
    state: {
      happiness: 80,
      hunger: 50,
      energy: 70,
      health: 100
    },
    ownerId: 'user-uuid',
    createdAt: Date,
    updatedAt: Date
  }
}
```

#### Errors

- `401`: "You must be logged in"
- `400`: "Monster ID is required"
- `404`: "Monster not found or access denied"
- `500`: "Failed to fetch monster"

---

### Update Monster State

Updates a monster's state values (happiness, hunger, energy, health).

```typescript
updateMonsterState(
  id: string,
  updates: Partial<MonsterState>
): Promise<OperationResult<IMonster>>
```

#### Parameters

```typescript
interface MonsterState {
  happiness: number  // 0-100
  hunger: number     // 0-100
  energy: number     // 0-100
  health: number     // 0-100
}
```

#### Example Usage

```tsx
'use client'

import { updateMonsterState } from '@/actions/monsters.actions'

async function feedMonster(monsterId: string) {
  const result = await updateMonsterState(monsterId, {
    hunger: 80,      // Increase hunger satisfaction
    happiness: 85    // Feeding makes monster happy
  })
  
  if (!result.success) {
    console.error('Failed to feed:', result.error)
    return
  }
  
  console.log('Monster fed!', result.data)
}

async function playWithMonster(monsterId: string) {
  const result = await updateMonsterState(monsterId, {
    happiness: 95,
    energy: 60       // Playing reduces energy
  })
  
  if (result.success) {
    console.log('Had fun!', result.data)
  }
}
```

#### Validation Rules

- All state values must be between 0 and 100
- Only provided fields are updated (partial update)
- Owner validation enforced

#### Response

```typescript
{
  success: true,
  data: {
    id: 'monster-uuid',
    name: 'Fluffy',
    state: {
      happiness: 85,  // Updated
      hunger: 80,     // Updated
      energy: 70,     // Unchanged
      health: 100     // Unchanged
    },
    // ... other fields
  }
}
```

#### Errors

- `401`: "You must be logged in"
- `400`: "Monster ID is required"
- `400`: "State values must be between 0 and 100"
- `404`: "Monster not found or access denied"
- `500`: "Failed to update monster state"

---

## Data Types

### IMonster

Complete monster entity interface.

```typescript
interface IMonster {
  id: string
  name: string
  templateId: string
  color?: string
  description?: string
  ownerId: string
  state: MonsterState
  createdAt: Date
  updatedAt: Date
}
```

### MonsterState

Current state values of a monster.

```typescript
interface MonsterState {
  happiness: number   // 0-100, affects mood
  hunger: number      // 0-100, 0 = very hungry
  energy: number      // 0-100, affects activity
  health: number      // 0-100, overall wellbeing
}
```

### OperationResult

Standard response wrapper.

```typescript
type OperationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }
```

## Templates

Available monster templates:

| Template ID | Description |
|------------|-------------|
| `chat-cosmique` | Cosmic cat creature |
| `dino-nuage` | Cloud dinosaur |
| `fairy-monster` | Fairy monster |
| `grenouille-etoilee` | Starry frog |

## Cache Strategy

Monster data is cached using Next.js automatic caching. Cache is revalidated after mutations:

```typescript
// After create/update
revalidatePath('/dashboard')
revalidatePath('/creatures')
revalidatePath(`/creatures/${monsterId}`)
```

## Security

### Authentication

All operations require valid session:

```typescript
const session = await auth()
if (!session?.user?.id) {
  return { success: false, error: 'Unauthorized' }
}
```

### Authorization

Monsters can only be accessed/modified by their owner:

```typescript
const monster = await service.getMonsterById(monsterId, userId)
// Automatically validates ownership
```

## Best Practices

### ✅ DO

```tsx
// Check result before accessing data
const result = await getMonsterById(id)
if (!result.success) {
  handleError(result.error)
  return
}
const monster = result.data

// Validate state values
const happiness = Math.max(0, Math.min(100, newHappiness))

// Handle loading states
const [loading, setLoading] = useState(true)
```

### ❌ DON'T

```tsx
// Don't assume success
const monster = (await getMonsterById(id)).data // May be undefined!

// Don't exceed state bounds
await updateMonsterState(id, { happiness: 150 }) // Invalid!

// Don't skip error handling
await createMonster(data) // What if it fails?
```

## Complete Example

```tsx
'use client'

import { 
  createMonster, 
  getMonsters, 
  updateMonsterState 
} from '@/actions/monsters.actions'
import { useState, useEffect } from 'react'
import type { IMonster } from '@/types/monster.types'

export function MonsterManager() {
  const [monsters, setMonsters] = useState<IMonster[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()

  // Load monsters on mount
  useEffect(() => {
    loadMonsters()
  }, [])

  async function loadMonsters() {
    setLoading(true)
    setError(undefined)
    
    const result = await getMonsters()
    
    if (!result.success) {
      setError(result.error)
    } else {
      setMonsters(result.data)
    }
    
    setLoading(false)
  }

  async function handleCreateMonster(name: string) {
    const result = await createMonster({
      name,
      templateId: 'chat-cosmique',
      color: '#bce5c3'
    })
    
    if (!result.success) {
      setError(result.error)
      return
    }
    
    // Reload list
    await loadMonsters()
  }

  async function feedMonster(id: string) {
    const result = await updateMonsterState(id, {
      hunger: 90,
      happiness: 85
    })
    
    if (!result.success) {
      setError(result.error)
      return
    }
    
    // Update local state
    setMonsters(prev =>
      prev.map(m => m.id === id ? result.data : m)
    )
  }

  if (loading) return <p>Loading monsters...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <div>
      <h1>My Monsters</h1>
      
      <button onClick={() => handleCreateMonster('New Monster')}>
        Create Monster
      </button>

      <div className="grid gap-4">
        {monsters.map(monster => (
          <div key={monster.id} className="border rounded p-4">
            <h3>{monster.name}</h3>
            <p>Happiness: {monster.state.happiness}</p>
            <p>Hunger: {monster.state.hunger}</p>
            
            <button onClick={() => feedMonster(monster.id)}>
              Feed
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Related Documentation

- [API Overview](./overview) - Server Actions architecture
- [Monster Types](../types/monsters) - Type definitions
- [Service Layer](../architecture/service-layer) - Business logic
- [Repository Layer](../architecture/database-layer) - Data access
