# useMonsterPolling Hook

## Overview

React hook for periodically polling monster data with automatic state change detection. Works seamlessly with the lazy state decay system.

## Import

```typescript
import { useMonsterPolling } from '@/hooks/use-monster-polling'
```

## Type Definitions

### Options

```typescript
interface UseMonsterPollingOptions {
  /** Initial monster data from server */
  initialMonster: Monster
  
  /** Callback invoked when state changes */
  onStateChange?: (newState: string, oldState: string) => void
  
  /** Polling interval in milliseconds (default: 2000) */
  pollingInterval?: number
  
  /** Enable/disable polling (default: true) */
  enabled?: boolean
  
  /** Enable verbose console logging (default: false) */
  verbose?: boolean
}
```

### Return Value

```typescript
interface UseMonsterPollingReturn {
  /** Current monster data (updated on each poll) */
  monster: Monster
  
  /** Whether a fetch is currently in progress */
  isLoading: boolean
  
  /** Manually trigger a refresh */
  refresh: () => Promise<void>
}
```

## Usage

### Basic Usage

```tsx
import { useMonsterPolling } from '@/hooks/use-monster-polling'

function MonsterCard({ initialMonster }) {
  const { monster, isLoading } = useMonsterPolling({
    initialMonster,
    pollingInterval: 2000 // Poll every 2 seconds
  })
  
  return (
    <div>
      <h3>{monster.name}</h3>
      <p>State: {monster.state}</p>
      {isLoading && <span>Updating...</span>}
    </div>
  )
}
```

### With State Change Callback

```tsx
import { useState } from 'react'
import { useMonsterPolling } from '@/hooks/use-monster-polling'

function MonsterPage({ initialMonster }) {
  const [notification, setNotification] = useState(null)
  
  const { monster } = useMonsterPolling({
    initialMonster,
    onStateChange: (newState, oldState) => {
      console.log(`State changed: ${oldState} → ${newState}`)
      setNotification({
        message: `${monster.name} is now ${newState}!`,
        timestamp: Date.now()
      })
    },
    pollingInterval: 2000,
    verbose: true // Enable logging for debugging
  })
  
  return (
    <div>
      <h1>{monster.name}</h1>
      <p>Current state: {monster.state}</p>
      {notification && <div className="notification">{notification.message}</div>}
    </div>
  )
}
```

### Conditional Polling

```tsx
function MonsterCard({ initialMonster, isVisible }) {
  const { monster } = useMonsterPolling({
    initialMonster,
    enabled: isVisible, // Only poll when card is visible
    pollingInterval: 3000
  })
  
  return <div>{/* ... */}</div>
}
```

### Manual Refresh

```tsx
function MonsterPage({ initialMonster }) {
  const { monster, refresh, isLoading } = useMonsterPolling({
    initialMonster,
    enabled: false // Disable auto-polling
  })
  
  const handleRefresh = async () => {
    await refresh()
    console.log('Monster refreshed!')
  }
  
  return (
    <div>
      <h1>{monster.name}</h1>
      <button onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  )
}
```

## Configuration

### Recommended Polling Intervals

| Component Type | Interval | Reason |
|----------------|----------|--------|
| Detail pages | 2000ms (2s) | Fast updates for engaged users |
| Card lists | 3000ms (3s) | Balance between freshness and load |
| Background/hidden | Disabled | Save resources when not visible |

### Performance Considerations

```tsx
// ✅ Good: Reasonable interval
const { monster } = useMonsterPolling({
  initialMonster,
  pollingInterval: 2000 // 2 seconds
})

// ⚠️ Caution: Very frequent polling
const { monster } = useMonsterPolling({
  initialMonster,
  pollingInterval: 500 // 0.5 seconds - may cause high load
})

// ❌ Bad: Immediate polling
const { monster } = useMonsterPolling({
  initialMonster,
  pollingInterval: 0 // Don't do this!
})
```

## Behavior

### Polling Lifecycle

1. **Mount**: Immediate first fetch
2. **Interval**: Fetch every `pollingInterval` milliseconds
3. **State change**: Callback triggered if state differs
4. **Unmount**: Cleanup interval and pending requests

### State Change Detection

The hook compares the `state` field between fetches:

```typescript
// Old state: 'happy'
// New state: 'hungry'
// → onStateChange('hungry', 'happy') called
```

### Concurrency Control

The hook prevents concurrent fetches:

```typescript
// If a fetch is in progress, new fetch is skipped
// This prevents race conditions and excessive load
```

### Error Handling

Errors are caught and logged (if `verbose: true`), but don't break the polling loop:

```typescript
try {
  await fetchMonster()
} catch (error) {
  console.error('Error fetching monster:', error)
  // Polling continues on next interval
}
```

## Advanced Patterns

### Visibility-Based Polling

Use Intersection Observer to poll only when visible:

```tsx
import { useEffect, useState } from 'react'
import { useMonsterPolling } from '@/hooks/use-monster-polling'

function MonsterCard({ initialMonster }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    })
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  const { monster } = useMonsterPolling({
    initialMonster,
    enabled: isVisible,
    pollingInterval: 3000
  })
  
  return <div ref={ref}>{/* ... */}</div>
}
```

### Tab Visibility

Stop polling when tab is not active:

```tsx
import { useEffect, useState } from 'react'

function MonsterPage({ initialMonster }) {
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden)
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
  
  const { monster } = useMonsterPolling({
    initialMonster,
    enabled: isTabVisible,
    pollingInterval: 2000
  })
  
  return <div>{/* ... */}</div>
}
```

### Batched State Changes

Collect multiple state changes:

```tsx
function MonsterPage({ initialMonster }) {
  const [stateHistory, setStateHistory] = useState([])
  
  const { monster } = useMonsterPolling({
    initialMonster,
    onStateChange: (newState, oldState) => {
      setStateHistory(prev => [...prev, {
        from: oldState,
        to: newState,
        timestamp: Date.now()
      }])
    }
  })
  
  return (
    <div>
      <h1>{monster.name}</h1>
      <ul>
        {stateHistory.map((change, i) => (
          <li key={i}>
            {change.from} → {change.to} at {new Date(change.timestamp).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useMonsterPolling } from '@/hooks/use-monster-polling'

// Mock fetch
global.fetch = jest.fn()

describe('useMonsterPolling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should fetch monster immediately on mount', async () => {
    const initialMonster = { id: '1', name: 'Test', state: 'happy' }
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => initialMonster
    })
    
    const { result } = renderHook(() => 
      useMonsterPolling({ initialMonster })
    )
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/monsters/1',
        expect.any(Object)
      )
    })
  })
  
  it('should detect state changes', async () => {
    const initialMonster = { id: '1', name: 'Test', state: 'happy' }
    const updatedMonster = { ...initialMonster, state: 'hungry' }
    const onStateChange = jest.fn()
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedMonster
    })
    
    const { result } = renderHook(() => 
      useMonsterPolling({ 
        initialMonster,
        onStateChange
      })
    )
    
    await waitFor(() => {
      expect(onStateChange).toHaveBeenCalledWith('hungry', 'happy')
    })
  })
  
  it('should not trigger callback if state unchanged', async () => {
    const initialMonster = { id: '1', name: 'Test', state: 'happy' }
    const onStateChange = jest.fn()
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => initialMonster
    })
    
    const { result } = renderHook(() => 
      useMonsterPolling({ 
        initialMonster,
        onStateChange,
        pollingInterval: 100
      })
    )
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
    
    expect(onStateChange).not.toHaveBeenCalled()
  })
})
```

## Troubleshooting

### Polling not working

**Problem**: Monster data never updates

**Solutions**:
1. Check `enabled` prop is `true`
2. Verify `pollingInterval` is set correctly
3. Check network tab for API calls
4. Enable `verbose: true` to see logs

### State changes not detected

**Problem**: `onStateChange` callback not called

**Solutions**:
1. Verify backend is actually changing state
2. Check `monster.state` field exists in API response
3. Enable verbose logging to see state comparisons
4. Ensure `previousStateRef` is tracking correctly

### Memory leaks

**Problem**: Intervals continue after unmount

**Solutions**:
1. The hook automatically cleans up - check for custom implementations
2. Verify component is properly unmounting
3. Check React DevTools for lingering intervals

### High API load

**Problem**: Too many API calls

**Solutions**:
1. Increase `pollingInterval` (e.g., 3000-5000ms)
2. Disable polling when component not visible
3. Use conditional `enabled` prop
4. Check for duplicate hook calls

## Performance Tips

### 1. Adjust interval by importance

```tsx
// High priority: detail page
<MonsterDetailPage pollingInterval={2000} />

// Medium priority: card in list
<MonsterCard pollingInterval={3000} />

// Low priority: background component
<MonsterStats pollingInterval={5000} />
```

### 2. Disable when not needed

```tsx
const { monster } = useMonsterPolling({
  initialMonster,
  enabled: isActive && isVisible && !isPaused
})
```

### 3. Use React.memo for child components

```tsx
const MonsterCard = React.memo(({ monster }) => {
  // Only re-renders when monster changes
  return <div>{monster.name}</div>
})
```

## Related

- [Lazy State Decay System](../architecture/lazy-state-system.md)
- [Monster State Decay Utility](./monster-state-decay.md)
- [Monster API Routes](./monsters.md)

## Changelog

### v1.0.0 (2025-10-30)
- Initial release of lazy polling system
- State change detection with callbacks
- Configurable polling intervals
- Performance-optimized for scalability
