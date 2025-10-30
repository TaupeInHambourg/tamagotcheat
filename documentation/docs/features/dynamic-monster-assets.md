# Dynamic Monster Assets

## Overview

TamagoTcheat features a dynamic asset system that automatically displays the correct SVG image for each monster based on their current emotional state. This creates a living, responsive experience where monsters visually reflect their mood in real-time.

## How It Works

### Asset Structure

Each monster type has a dedicated folder containing 5 SVG files, one for each possible state:

```
public/assets/tamagocheats/
├── chat-cosmique/
│   ├── happy.svg
│   ├── sad.svg
│   ├── angry.svg
│   ├── hungry.svg
│   └── sleepy.svg
├── dino-nuage/
│   ├── happy.svg
│   ├── sad.svg
│   ├── angry.svg
│   ├── hungry.svg
│   └── sleepy.svg
└── ... (other monsters)
```

### Asset Resolution

The `monster-asset-resolver` utility automatically constructs the correct asset path based on:

1. **Monster folder path** - Extracted from the monster's `draw` field
2. **Current state** - The monster's emotional state (happy, sad, angry, hungry, sleepy)

```typescript
import { getMonsterAssetPath, extractFolderPath } from '@/utils/monster-asset-resolver'

// Extract the folder from stored path
const folderPath = extractFolderPath(monster.draw)
// Result: "chat-cosmique"

// Get the current state's asset
const currentAsset = getMonsterAssetPath(folderPath, monster.state)
// Result: "/assets/tamagocheats/chat-cosmique/happy.svg"
```

## Integration with Lazy State System

The dynamic asset system works seamlessly with the lazy state computation:

1. **Backend** - `getMonsterById()` computes the current state using `computeCurrentState()`
2. **State Update** - If the state changed, the database is updated
3. **Polling** - Frontend polls the API every 2-3 seconds
4. **Asset Resolution** - Component resolves the correct asset path based on new state
5. **Display** - React automatically re-renders with the new image

This creates a smooth, automatic visual feedback loop where monsters' appearances update in real-time as their states change.

## Usage in Components

### Monster Card

```tsx
import { getMonsterAssetPath, extractFolderPath } from '@/utils/monster-asset-resolver'

export default function MonsterCard({ monster }) {
  const folderPath = extractFolderPath(monster.draw)
  const currentAsset = getMonsterAssetPath(folderPath, monster.state)
  
  return (
    <Image
      src={currentAsset}
      alt={monster.name}
      fill
      className="object-contain"
    />
  )
}
```

### Monster Detail Page

```tsx
import { useMemo } from 'react'
import { getMonsterAssetPath, extractFolderPath } from '@/utils/monster-asset-resolver'

export default function MonsterPage({ monster }) {
  // Memoize for performance
  const folderPath = useMemo(
    () => extractFolderPath(monster.draw), 
    [monster.draw]
  )
  const currentAsset = useMemo(
    () => getMonsterAssetPath(folderPath, monster.state), 
    [folderPath, monster.state]
  )
  
  return (
    <Image
      src={currentAsset}
      alt={monster.name}
      priority
    />
  )
}
```

## Performance Considerations

### Memoization

Use React's `useMemo` hook for asset path resolution in frequently re-rendering components:

```typescript
const folderPath = useMemo(
  () => extractFolderPath(monster.draw), 
  [monster.draw]
)

const currentAsset = useMemo(
  () => getMonsterAssetPath(folderPath, monster.state), 
  [folderPath, monster.state]
)
```

This ensures asset paths are only recalculated when the state actually changes, not on every render.

### Image Optimization

Next.js automatically optimizes SVG images served through the `Image` component:

- **Lazy loading** - Images load only when visible
- **Priority loading** - Use `priority` prop for above-the-fold images
- **Responsive sizing** - Automatically serves appropriately sized images

## Adding New Monster States

To add a new monster state:

1. **Update Type Definition** (`src/types/monster.types.ts`):
```typescript
export const MONSTER_STATES = [
  'happy', 'sad', 'angry', 'hungry', 'sleepy', 
  'excited' // New state
] as const
```

2. **Add SVG Assets** - Create `excited.svg` for each monster folder

3. **Update State Logic** (`src/utils/monster-state-decay.ts`):
```typescript
const allStates: MonsterState[] = [
  'happy', 'sad', 'angry', 'hungry', 'sleepy', 
  'excited' // New state
]
```

4. **No changes needed** in asset resolver - it automatically handles new states!

## Architecture Benefits

### Single Responsibility

- **Asset Resolver** - Only handles path construction
- **State System** - Only handles state computation
- **Components** - Only handle display

Each system has a clear, focused purpose.

### Open/Closed Principle

The asset resolver is:
- **Open for extension** - Easy to add new states or monsters
- **Closed for modification** - Core logic doesn't change

### Dependency Inversion

Components depend on the abstract `getMonsterAssetPath()` function, not on concrete file paths. This makes it easy to:
- Change asset storage location
- Use CDN for assets
- Implement asset caching
- Switch to different file formats

## Troubleshooting

### Asset Not Found (404)

**Problem**: Monster displays broken image icon

**Solution**: Verify the asset file exists:
```bash
# Check if file exists
ls public/assets/tamagocheats/chat-cosmique/happy.svg

# Expected path format
/assets/tamagocheats/{folderPath}/{state}.svg
```

### Wrong Image Displayed

**Problem**: Monster shows incorrect state image

**Debug**:
```typescript
console.log('Folder:', extractFolderPath(monster.draw))
console.log('State:', monster.state)
console.log('Path:', getMonsterAssetPath(folderPath, monster.state))
```

Check that:
1. `monster.state` is a valid state value
2. Folder path is extracted correctly
3. Asset file exists for that state

### State Not Updating

**Problem**: Image doesn't change when state changes

**Solution**: Check the polling system:
```typescript
const { monster } = useMonsterPolling({
  initialMonster,
  enabled: true, // Must be true!
  verbose: true  // Enable logging to debug
})
```

Verify in console that:
1. Polling is active
2. State changes are detected
3. Component re-renders with new state

## Related Documentation

- [Lazy State System](../architecture/lazy-state-system.md) - State computation
- [Monster State Decay](../api/monster-state-decay.md) - State change logic
- [useMonsterPolling Hook](../api/use-monster-polling.md) - Frontend polling
