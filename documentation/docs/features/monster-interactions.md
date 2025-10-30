# Monster Interactions

## Overview

The monster interaction system allows users to care for their monsters by performing specific actions that correspond to their current emotional state. This feature implements a simple game mechanic where users must identify the correct action to make their monster happy.

## Business Rules

### Action-State Mapping

Each monster state requires a specific action to return to the "happy" state:

| Monster State | Required Action | Button Label |
|--------------|----------------|--------------|
| `hungry` | `feed` | 🍪 Nourrir |
| `sleepy` | `sleep` | 💤 Mettre au lit |
| `sad` | `play` | 🎮 Jouer |
| `angry` | `cuddle` | 💕 Câliner |
| `happy` | _(none)_ | _(all actions ignored)_ |

### Interaction Logic

1. **Correct Action**: If the user clicks the button that matches the current state, the monster transitions to "happy" state and timing is reset.
2. **Wrong Action**: If the user clicks a button that doesn't match the current state, nothing happens (silent fail).
3. **Already Happy**: If the monster is already happy, all actions are ignored.

## Architecture

The interaction system follows Clean Architecture principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│  (monster-page-client.tsx)                              │
│  - User clicks button                                    │
│  - Shows loading state                                   │
│  - Displays toast notifications                          │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   Actions Layer                          │
│  (monsters.actions.ts)                                   │
│  - Handles authentication                                │
│  - Delegates to service                                  │
│  - Revalidates cache                                     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  Service Layer                           │
│  (monster.service.ts)                                    │
│  - Enforces business rules                               │
│  - Validates action/state matching                       │
│  - Updates monster state and timing                      │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                 Repository Layer                         │
│  (monster.repository.ts)                                 │
│  - Persists state changes to database                    │
└─────────────────────────────────────────────────────────┘
```

## SOLID Principles Applied

### Single Responsibility Principle (S)
- **MonsterPageClient**: Only handles UI interactions and state display
- **interactWithMonster action**: Only handles authentication and cache revalidation
- **MonsterService.interactWithMonster**: Only handles business logic validation

### Open/Closed Principle (O)
- Action-state mapping is defined as a data structure, making it easy to extend without modifying code
- New actions can be added by updating the `MONSTER_ACTIONS` constant and the mapping

### Liskov Substitution Principle (L)
- All service methods return the same `OperationResult<T>` type
- Error handling is consistent across all operations

### Interface Segregation Principle (I)
- `IMonsterService` interface only exposes the methods needed by consumers
- Each method has a single, clear purpose

### Dependency Inversion Principle (D)
- Actions depend on service interface, not implementation
- Service depends on repository interface, not implementation
- Client code depends on server actions, not direct service calls

## Type Safety

The system uses TypeScript union types for compile-time safety:

```typescript
// Monster states
export type MonsterState = 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy'

// Interaction actions
export type MonsterAction = 'feed' | 'sleep' | 'play' | 'cuddle'

// Type-safe mapping
const actionStateMap: Record<MonsterAction, MonsterState> = {
  feed: 'hungry',
  sleep: 'sleepy',
  play: 'sad',
  cuddle: 'angry'
}
```

## User Experience

### Success Flow

1. User observes monster is in "hungry" state
2. User clicks "🍪 Nourrir" button
3. Button shows loading state (disabled)
4. Success toast appears: "✨ Nourrir a fonctionné ! [Name] est maintenant heureux ! 😄"
5. Monster visual updates to happy state
6. State polling continues in background

### Failure Flow (Wrong Action)

1. User observes monster is in "hungry" state
2. User clicks "💤 Mettre au lit" button (wrong action)
3. Button briefly shows loading state
4. Nothing happens (silent fail)
5. No toast notification shown
6. Monster remains in "hungry" state

### Already Happy

1. Monster is in "happy" state
2. User clicks any interaction button
3. No action is taken (backend rejects)
4. Monster remains happy

## Implementation Details

### Client-Side (monster-page-client.tsx)

```typescript
const handleInteraction = useCallback(async (action: string, actionLabel: string) => {
  if (isInteracting) return
  
  setIsInteracting(true)
  
  try {
    const result = await interactWithMonster(initialMonster.id ?? '', action)
    
    if (result.success) {
      // Show success toast
      toast.success(`✨ ${actionLabel} a fonctionné!`)
    }
    // Wrong action = silent fail (no error toast)
  } finally {
    setIsInteracting(false)
  }
}, [initialMonster.id, initialMonster.name, isInteracting])
```

### Server Action (monsters.actions.ts)

```typescript
export async function interactWithMonster(
  monsterId: string,
  action: string
): Promise<{ success: boolean, error?: string, monster?: Monster }> {
  const user = await getAuthenticatedUser()
  const monsterService = createMonsterService()
  const result = await monsterService.interactWithMonster(user.id, monsterId, action)
  
  if (result.success) {
    revalidatePath(`/creatures/${monsterId}`)
  }
  
  return result
}
```

### Service Layer (monster.service.ts)

```typescript
async interactWithMonster(
  userId: string, 
  monsterId: string, 
  action: string
): Promise<OperationResult<Monster>> {
  // 1. Fetch monster
  const monster = await this.getMonsterById(userId, monsterId)
  
  // 2. Validate action
  if (!MONSTER_ACTIONS.includes(action)) {
    return { success: false, error: 'Invalid action' }
  }
  
  // 3. Check if already happy
  if (monster.state === 'happy') {
    return { success: false, error: 'Already happy' }
  }
  
  // 4. Validate action matches state
  const requiredState = actionStateMap[action]
  if (monster.state !== requiredState) {
    return { success: false, error: 'Wrong action' }
  }
  
  // 5. Update to happy state
  const timing = initializeMonsterTiming('happy')
  return await this.monsterRepository.update(monsterId, userId, timing)
}
```

## Testing Considerations

### Unit Tests (Service Layer)

```typescript
describe('MonsterService.interactWithMonster', () => {
  it('should make hungry monster happy when fed', async () => {
    // Arrange: Monster is hungry
    // Act: Call interactWithMonster with 'feed'
    // Assert: Monster state is now 'happy'
  })
  
  it('should fail silently when wrong action is used', async () => {
    // Arrange: Monster is hungry
    // Act: Call interactWithMonster with 'sleep'
    // Assert: Returns error, monster state unchanged
  })
  
  it('should reject actions when monster is already happy', async () => {
    // Arrange: Monster is happy
    // Act: Call interactWithMonster with any action
    // Assert: Returns error, monster state unchanged
  })
})
```

### Integration Tests

- Test authentication flow
- Test cache revalidation
- Test concurrent interactions
- Test database state persistence

## Future Enhancements

1. **Combo System**: Reward consecutive correct actions
2. **Action Cooldowns**: Prevent spam clicking
3. **Experience Gain**: Award XP for correct interactions
4. **Animation Effects**: Visual feedback for actions
5. **Sound Effects**: Audio feedback for interactions
6. **Statistics**: Track user interaction accuracy
