# Lazy State Decay System

## Overview

The lazy state decay system is a performance-optimized approach to handling monster state changes. State changes are computed **on-demand** when a monster is read, eliminating the need for background jobs or scheduled tasks.

## Architecture Principles

### SOLID Principles Applied

1. **Single Responsibility Principle (S)**
   - Each component has one clear purpose
   - State computation logic is isolated in `monster-state-decay.ts`
   - Polling logic is separated in `use-monster-polling.ts`

2. **Open/Closed Principle (O)**
   - System is extensible without modification
   - New state types can be added by extending the decay utility
   - Polling intervals are configurable per component

3. **Dependency Inversion Principle (D)**
   - Components depend on abstractions (hooks) not concrete implementations
   - Backend service uses repository interfaces

### Clean Architecture

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer (UI)               │
│  ┌──────────────────────────────────────────┐  │
│  │  MonsterCard, MonsterPage       │  │
│  │  Uses: useMonsterPolling hook            │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           Application Layer (Hooks)             │
│  ┌──────────────────────────────────────────┐  │
│  │  useMonsterPolling                       │  │
│  │  - Polls API every 2-3 seconds          │  │
│  │  - Detects state changes                │  │
│  │  - Triggers callbacks                   │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           API Layer (Routes)                    │
│  ┌──────────────────────────────────────────┐  │
│  │  GET /api/monsters/[id]                  │  │
│  │  - Fetches monster                       │  │
│  │  - Triggers lazy computation            │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           Business Logic Layer (Services)       │
│  ┌──────────────────────────────────────────┐  │
│  │  MonsterService.getMonsterById()         │  │
│  │  1. Fetch monster from DB                │  │
│  │  2. Apply computeCurrentState()          │  │
│  │  3. Update DB if state changed           │  │
│  │  4. Return updated monster               │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           Domain Layer (Utilities)              │
│  ┌──────────────────────────────────────────┐  │
│  │  monster-state-decay.ts                  │  │
│  │  - computeCurrentState()                 │  │
│  │  - Checks nextStateChangeAt              │  │
│  │  - Computes new state if needed          │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│           Data Layer (Repository)               │
│  ┌──────────────────────────────────────────┐  │
│  │  MonsterRepository                       │  │
│  │  - Database access                       │  │
│  │  - CRUD operations                       │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## How It Works

### 1. On-Demand State Computation

When a monster is fetched via `getMonsterById()`:

```typescript
async getMonsterById(userId: string, monsterId: string) {
  // 1. Fetch monster from database
  const monster = await repository.findByIdAndOwner(monsterId, userId)
  
  // 2. Apply lazy state decay computation
  const stateResult = computeCurrentState(monster)
  
  // 3. If state changed, update database
  if (stateResult.changed) {
    await repository.update(monsterId, userId, {
      state: stateResult.state,
      lastStateChange: stateResult.lastStateChange,
      nextStateChangeAt: stateResult.nextStateChangeAt
    })
  }
  
  // 4. Return up-to-date monster
  return monster
}
```

### 2. State Change Logic

Each monster has a `nextStateChangeAt` timestamp stored in the database:

```typescript
export function computeCurrentState(monster: Monster): StateChangeResult {
  const now = new Date()
  
  // Check if it's time for a state change
  const shouldChange = now >= monster.nextStateChangeAt
  
  if (shouldChange) {
    // Time to change state
    const newState = getRandomState(monster.state)
    
    return {
      changed: true,
      state: newState,
      nextStateChangeAt: computeNextStateChangeAt(), // 1-3 minutes
      lastStateChange: now
    }
  }
  
  // No change needed
  return {
    changed: false,
    state: monster.state,
    nextStateChangeAt: monster.nextStateChangeAt
  }
}
```

### 3. Frontend Polling

Components use `useMonsterPolling` to periodically refresh data:

```typescript
const { monster } = useMonsterPolling({
  initialMonster: serverMonster,
  onStateChange: (newState, oldState) => {
    console.log(`State changed: ${oldState} → ${newState}`)
  },
  pollingInterval: 2000, // 2 seconds
  enabled: true
})
```

## Performance Benefits

### Lazy State System ✅

```
Only when monster is viewed:
├─ Frontend polls /api/monsters/[id] every 2s
├─ Backend fetches ONLY requested monster
├─ Backend checks if now >= nextStateChangeAt
└─ Updates database ONLY if state should change

Cost: O(1) per viewed monster
Benefit: Only updates active monsters
```

### Scalability

| Metric | Lazy System |
|--------|------------|
| **Database writes** | Only when viewed + time elapsed |
| **Database reads** | Only viewed monsters every 2s |
| **API calls** | O(active_pages) every 2s |
| **Scalability** | ✅ Excellent (grows with active views) |
| **Server load** | Load proportional to usage |

### Example Scenario

**1000 monsters in database, 10 users online, 3 viewing monster pages:**

| Operation | Per Minute | Notes |
|-----------|------------|-------|
| DB Reads | 90 (3×30) | Only for viewed monsters |
| DB Writes | ~1-2 | Only when state actually changes |
| API Calls | 90 (3×30) | Polling from active pages |

**Result: Efficient and scalable!**

## State Change Intervals

Monsters change state randomly between **1-3 minutes**:

```typescript
const MIN_STATE_CHANGE_INTERVAL = 60 * 1000 // 1 minute
const MAX_STATE_CHANGE_INTERVAL = 3 * 60 * 1000 // 3 minutes
```

Each monster gets its own random interval, making behavior more natural and unpredictable.

## Key Components

### Core Files

1. **`src/utils/monster-state-decay.ts`**
   - Pure business logic
   - State computation algorithms
   - No dependencies on framework

2. **`src/hooks/use-monster-polling.ts`**
   - React hook for polling
   - State change detection
   - Callback management

3. **`src/services/implementations/monster.service.ts`**
   - Integrates lazy computation
   - Orchestrates database updates
   - Applies business rules

### Integration Points

```typescript
// 1. Create monster with timing fields
const timingFields = initializeMonsterTiming('happy')
await createMonster({ name: 'Fluffy', ...timingFields })

// 2. Fetch monster (lazy computation happens here)
const monster = await getMonsterById(userId, monsterId)

// 3. Display with auto-refresh
<MonsterCard initialMonster={monster} autoRefresh={true} />
```

## Testing Strategy

### Unit Tests

```typescript
describe('computeCurrentState', () => {
  it('should not change state if time not elapsed', () => {
    const monster = {
      state: 'happy',
      nextStateChangeAt: new Date(Date.now() + 60000) // 1 min future
    }
    
    const result = computeCurrentState(monster)
    
    expect(result.changed).toBe(false)
    expect(result.state).toBe('happy')
  })
  
  it('should change state if time elapsed', () => {
    const monster = {
      state: 'happy',
      nextStateChangeAt: new Date(Date.now() - 1000) // 1s past
    }
    
    const result = computeCurrentState(monster)
    
    expect(result.changed).toBe(true)
    expect(result.state).not.toBe('happy')
    expect(['sad', 'angry', 'hungry', 'sleepy']).toContain(result.state)
  })
})
```

### Integration Tests

```typescript
describe('MonsterService.getMonsterById', () => {
  it('should apply lazy state decay on read', async () => {
    // Create monster with expired nextStateChangeAt
    const monster = await createMonster({
      name: 'Test',
      state: 'happy',
      nextStateChangeAt: new Date(Date.now() - 60000)
    })
    
    // Fetch monster
    const result = await monsterService.getMonsterById(userId, monster.id)
    
    // State should have changed
    expect(result.data.state).not.toBe('happy')
    expect(result.data.nextStateChangeAt).toBeGreaterThan(new Date())
  })
})
```

## Migration from Old System

See [Migration Guide](../guides/local-development.md) for detailed steps.

## Best Practices

### ✅ Do

- Use `useMonsterPolling` for auto-refreshing components
- Set appropriate polling intervals (2-3s for detail pages, 3-5s for lists)
- Disable auto-refresh when component is not visible
- Handle state change callbacks for user feedback

### ❌ Don't

- Create custom polling logic (use the hook)
- Poll more frequently than 1 second (unnecessary load)
- Forget to disable polling on unmount (memory leaks)
- Manually update `nextStateChangeAt` (let the system handle it)

## Monitoring

### Key Metrics to Track

- **Average polling frequency** (requests/second per active user)
- **State change rate** (changes/minute)
- **Database write ratio** (writes caused by state changes vs total reads)
- **API response time** for `/api/monsters/[id]`

### Expected Values

- Polling frequency: 0.3-0.5 req/s per active user (with 2s interval)
- State change rate: ~10-30 changes/min for 100 active monsters
- Write ratio: ~1-2% (98% of reads don't trigger writes)
- API response time: less than 100ms

## Troubleshooting

### State not changing

- Check `nextStateChangeAt` is in the past
- Verify polling is enabled
- Check backend logs for computation errors
- Ensure `computeCurrentState` is called in service

### Too many database writes

- Check polling interval (should be ≥2 seconds)
- Verify only active monsters are being polled
- Check for duplicate polling (multiple hooks for same monster)

### Memory leaks

1. Ensure polling cleanup on unmount
2. Check for unclosed intervals
3. Verify refs are properly cleaned up

## Future Enhancements

### Potential Improvements

1. **WebSocket integration**: Push state changes instead of polling
2. **Optimistic updates**: Show predicted state client-side
3. **Batched reads**: Fetch multiple monsters in one request
4. **Redis caching**: Cache monster state with TTL
5. **State prediction**: ML model to predict state changes

### Backwards Compatibility

The system is designed to be backwards compatible:
- Old monsters without `nextStateChangeAt` get initialized on first read
- Polling can coexist with other update mechanisms
- State computation is idempotent (safe to call multiple times)

## References

- [Monster State Decay Utility](../api/monster-state-decay.md)
- [useMonsterPolling Hook](../api/use-monster-polling.md)
- [SOLID Principles](./solid-principles.md)
- [Database Layer](./database-layer.md)
