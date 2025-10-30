# Monster State Decay Utility

## Overview

Core utility module for computing monster state changes using a lazy evaluation pattern. This module contains pure functions with no side effects, making it easy to test and maintain.

## Import

```typescript
import { 
  computeCurrentState,
  computeNextStateChangeAt,
  initializeMonsterTiming,
  getTimeUntilNextChange
} from '@/utils/monster-state-decay'
```

## Core Concepts

### Lazy State Computation

This utility computes state changes **on-demand** when a monster is read:

```typescript
// Lazy approach
const monster = await getMonster(id)
const result = computeCurrentState(monster) // Computed only when needed
if (result.changed) {
  await updateMonster(id, result)
}
```

### State Change Timing

Each monster stores three timing fields:

- **`state`**: Current monster state ('happy', 'sad', 'angry', 'hungry', 'sleepy')
- **`lastStateChange`**: Timestamp of last state change
- **`nextStateChangeAt`**: Timestamp when next change should occur

## API Reference

### computeCurrentState()

Computes the current state of a monster based on elapsed time.

**Signature:**
```typescript
function computeCurrentState(monster: Monster): StateChangeResult
```

**Parameters:**
- `monster`: Monster object with timing fields

**Returns:**
```typescript
interface StateChangeResult {
  changed: boolean              // Whether state was changed
  state: MonsterState          // New (or unchanged) state
  nextStateChangeAt: Date      // When next change should occur
  lastStateChange?: Date       // Timestamp of change (if changed)
}
```

**Algorithm:**
1. Check if `nextStateChangeAt` is initialized
2. If not, initialize with current state and compute next change time
3. If `now >= nextStateChangeAt`, compute new random state
4. Otherwise, return current state unchanged

**Example:**
```typescript
const monster = {
  id: '123',
  name: 'Fluffy',
  state: 'happy',
  nextStateChangeAt: new Date('2025-10-30T10:00:00Z')
}

// Scenario 1: Before change time
const result1 = computeCurrentState(monster)
// { changed: false, state: 'happy', nextStateChangeAt: ... }

// Scenario 2: After change time
const monster2 = {
  ...monster,
  nextStateChangeAt: new Date('2025-10-30T09:00:00Z') // Past
}
const result2 = computeCurrentState(monster2)
// { changed: true, state: 'hungry', nextStateChangeAt: ..., lastStateChange: ... }
```

**State Transitions:**
- **Current state is excluded**: If monster is 'happy', new state will be one of: 'sad', 'angry', 'hungry', 'sleepy'
- **'happy' state is special**: Cannot be randomly generated, only achieved through user interactions

---

### computeNextStateChangeAt()

Generates a random timestamp for the next state change.

**Signature:**
```typescript
function computeNextStateChangeAt(): Date
```

**Returns:**
- Date object between 1-3 minutes in the future

**Interval:**
```typescript
const MIN_STATE_CHANGE_INTERVAL = 60 * 1000      // 1 minute
const MAX_STATE_CHANGE_INTERVAL = 3 * 60 * 1000  // 3 minutes
```

**Example:**
```typescript
const nextChange = computeNextStateChangeAt()
console.log(nextChange)
// 2025-10-30T10:02:34.567Z (somewhere between 1-3 min from now)
```

**Randomization:**
```typescript
const interval = Math.floor(
  Math.random() * (MAX - MIN + 1)
) + MIN

return new Date(Date.now() + interval)
```

---

### initializeMonsterTiming()

Initializes timing fields for a new monster.

**Signature:**
```typescript
function initializeMonsterTiming(
  initialState?: MonsterState
): {
  state: MonsterState
  lastStateChange: Date
  nextStateChangeAt: Date
}
```

**Parameters:**
- `initialState` (optional): Initial state (default: 'happy')

**Returns:**
- Object with initialized timing fields

**Example:**
```typescript
const timingFields = initializeMonsterTiming('happy')
// {
//   state: 'happy',
//   lastStateChange: 2025-10-30T10:00:00.000Z,
//   nextStateChangeAt: 2025-10-30T10:01:47.123Z (random 1-3 min)
// }

const monster = await createMonster({
  name: 'Fluffy',
  draw: '/images/fluffy.png',
  ...timingFields
})
```

**Use case:**
Call this when creating a new monster to ensure timing fields are properly set.

---

### getTimeUntilNextChange()

Gets milliseconds remaining until next state change.

**Signature:**
```typescript
function getTimeUntilNextChange(monster: Monster): number
```

**Parameters:**
- `monster`: Monster with `nextStateChangeAt` field

**Returns:**
- Milliseconds until next change (or 0 if overdue)

**Example:**
```typescript
const monster = {
  id: '123',
  name: 'Fluffy',
  state: 'happy',
  nextStateChangeAt: new Date(Date.now() + 120000) // 2 min future
}

const remaining = getTimeUntilNextChange(monster)
console.log(remaining) // ~120000

const seconds = Math.floor(remaining / 1000)
console.log(`Next change in ${seconds} seconds`) // "Next change in 120 seconds"

// For UI countdown
const minutes = Math.floor(remaining / 60000)
const secs = Math.floor((remaining % 60000) / 1000)
console.log(`${minutes}:${secs.toString().padStart(2, '0')}`) // "2:00"
```

**Edge cases:**
```typescript
// No nextStateChangeAt
const monster = { state: 'happy' }
getTimeUntilNextChange(monster) // 0

// Time already passed
const monster = {
  nextStateChangeAt: new Date(Date.now() - 60000) // 1 min ago
}
getTimeUntilNextChange(monster) // 0 (not negative)
```

## Constants

### State Change Intervals

```typescript
const MIN_STATE_CHANGE_INTERVAL = 60 * 1000      // 1 minute
const MAX_STATE_CHANGE_INTERVAL = 3 * 60 * 1000  // 3 minutes
```

**Rationale:**
- **1 minute minimum**: Fast enough to be engaging
- **3 minutes maximum**: Prevents too frequent changes
- **Random within range**: Makes behavior unpredictable and natural

### Available States

```typescript
const DECAY_STATES: MonsterState[] = ['sad', 'angry', 'hungry', 'sleepy']
```

**Note:** 'happy' is excluded from random decay - it can only be achieved through user actions.

## Integration Examples

### Backend Service Integration

```typescript
// src/services/implementations/monster.service.ts
import { computeCurrentState } from '@/utils/monster-state-decay'

async getMonsterById(userId: string, monsterId: string) {
  // 1. Fetch from database
  const monster = await this.repository.findByIdAndOwner(monsterId, userId)
  
  // 2. Apply lazy computation
  const stateResult = computeCurrentState(monster)
  
  // 3. Update if changed
  if (stateResult.changed) {
    const updated = await this.repository.update(monsterId, userId, {
      state: stateResult.state,
      lastStateChange: stateResult.lastStateChange,
      nextStateChangeAt: stateResult.nextStateChangeAt
    })
    return updated
  }
  
  return monster
}
```

### Monster Creation

```typescript
// src/actions/monsters.actions.ts
import { initializeMonsterTiming } from '@/utils/monster-state-decay'

async function createMonster(data: CreateMonsterDto) {
  const timingFields = initializeMonsterTiming('happy')
  
  const monster = await repository.create({
    ...data,
    ...timingFields
  })
  
  return monster
}
```

### UI Countdown

```typescript
// src/components/monster-countdown.tsx
import { getTimeUntilNextChange } from '@/utils/monster-state-decay'

function MonsterCountdown({ monster }) {
  const [timeLeft, setTimeLeft] = useState(
    getTimeUntilNextChange(monster)
  )
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextChange(monster))
    }, 1000)
    
    return () => clearInterval(timer)
  }, [monster])
  
  const seconds = Math.floor(timeLeft / 1000)
  
  return <div>Next mood change in: {seconds}s</div>
}
```

## Testing

### Unit Tests

```typescript
import { 
  computeCurrentState,
  computeNextStateChangeAt,
  initializeMonsterTiming
} from '@/utils/monster-state-decay'

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
      nextStateChangeAt: new Date(Date.now() - 1000) // Past
    }
    
    const result = computeCurrentState(monster)
    
    expect(result.changed).toBe(true)
    expect(result.state).not.toBe('happy')
    expect(['sad', 'angry', 'hungry', 'sleepy']).toContain(result.state)
  })
  
  it('should initialize missing nextStateChangeAt', () => {
    const monster = { state: 'happy', nextStateChangeAt: null }
    
    const result = computeCurrentState(monster)
    
    expect(result.changed).toBe(true)
    expect(result.nextStateChangeAt).toBeInstanceOf(Date)
    expect(result.nextStateChangeAt.getTime()).toBeGreaterThan(Date.now())
  })
  
  it('should not return same state as current', () => {
    const monster = {
      state: 'happy',
      nextStateChangeAt: new Date(Date.now() - 1000)
    }
    
    // Run multiple times to ensure randomness excludes current state
    for (let i = 0; i < 10; i++) {
      const result = computeCurrentState(monster)
      expect(result.state).not.toBe('happy')
    }
  })
})

describe('computeNextStateChangeAt', () => {
  it('should return future date', () => {
    const nextChange = computeNextStateChangeAt()
    expect(nextChange.getTime()).toBeGreaterThan(Date.now())
  })
  
  it('should be within 1-3 minutes', () => {
    const nextChange = computeNextStateChangeAt()
    const diff = nextChange.getTime() - Date.now()
    
    expect(diff).toBeGreaterThanOrEqual(60 * 1000) // >= 1 min
    expect(diff).toBeLessThanOrEqual(3 * 60 * 1000) // <= 3 min
  })
})

describe('initializeMonsterTiming', () => {
  it('should initialize with default happy state', () => {
    const result = initializeMonsterTiming()
    
    expect(result.state).toBe('happy')
    expect(result.lastStateChange).toBeInstanceOf(Date)
    expect(result.nextStateChangeAt).toBeInstanceOf(Date)
  })
  
  it('should accept custom initial state', () => {
    const result = initializeMonsterTiming('hungry')
    expect(result.state).toBe('hungry')
  })
})
```

## Best Practices

### ✅ Do

- **Call `computeCurrentState` on every read**: Ensures state is always up-to-date
- **Initialize new monsters**: Use `initializeMonsterTiming` when creating
- **Test edge cases**: Handle missing fields, past dates, etc.
- **Keep functions pure**: No side effects, same input = same output (except randomness)

### ❌ Don't

- **Manually set `nextStateChangeAt`**: Let the utility compute it
- **Forget to update database**: If `changed === true`, persist the new state
- **Assume state will change**: Check `changed` flag before updating
- **Use for user interactions**: User actions should directly set state, not use decay

## Performance Characteristics

### Time Complexity

| Function | Complexity | Notes |
|----------|-----------|-------|
| `computeCurrentState` | O(1) | Simple date comparison |
| `computeNextStateChangeAt` | O(1) | Math operations only |
| `initializeMonsterTiming` | O(1) | Object creation |
| `getTimeUntilNextChange` | O(1) | Simple subtraction |

### Space Complexity

All functions: O(1) - No dynamic allocations, fixed memory usage

### Scalability

- **Database impact**: O(1) per read (only updates when state changes)
- **CPU impact**: Negligible (simple math operations)
- **Memory impact**: None (stateless pure functions)

## Troubleshooting

### State not changing

**Problem**: `computeCurrentState` always returns `changed: false`

**Check**:
1. Is `nextStateChangeAt` in the future?
2. Is time moving forward? (check system clock)
3. Are you fetching fresh data from DB?

**Debug**:
```typescript
const result = computeCurrentState(monster)
console.log('Now:', new Date())
console.log('Next change:', monster.nextStateChangeAt)
console.log('Should change:', new Date() >= monster.nextStateChangeAt)
```

### State changing too quickly/slowly

**Problem**: Timing doesn't match expected intervals

**Check**:
1. Verify `MIN_STATE_CHANGE_INTERVAL` and `MAX_STATE_CHANGE_INTERVAL`
2. Check database is saving `nextStateChangeAt` correctly
3. Ensure no other process is modifying state

**Adjust intervals** if needed:
```typescript
// In monster-state-decay.ts
const MIN_STATE_CHANGE_INTERVAL = 30 * 1000      // 30 seconds
const MAX_STATE_CHANGE_INTERVAL = 5 * 60 * 1000  // 5 minutes
```

### Initialization issues

**Problem**: Old monsters without `nextStateChangeAt`

**Solution**: The utility automatically initializes missing fields:
```typescript
if (monster.nextStateChangeAt == null) {
  return {
    changed: true,
    state: monster.state,
    nextStateChangeAt: computeNextStateChangeAt(),
    lastStateChange: new Date()
  }
}
```

## Related Documentation

- [Lazy State System Architecture](../architecture/lazy-state-system.md)
- [useMonsterPolling Hook](./use-monster-polling.md)
- [Monster Service](./monster-service.md)
- [SOLID Principles](../architecture/solid-principles.md)

## Changelog

### v2.0.0 (2025-10-30)
- Reduced min interval to 1 minute (from 30 seconds)
- Reduced max interval to 3 minutes (from 5 minutes)
- Added comprehensive documentation
- Improved type safety
- Added initialization helper

### v1.0.0 (Initial)
- Basic state decay functionality
- Random state selection
- Timer-based state changes
