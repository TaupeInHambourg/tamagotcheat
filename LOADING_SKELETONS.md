# Loading Skeletons Implementation

## Overview
Implementation of loading skeleton states across the TamagoTcheat application using `react-loading-skeleton` library. This enhances UX by providing visual feedback during data fetching operations.

## Architecture & Design Principles

### SOLID Principles Applied

#### 1. Single Responsibility Principle (SRP)
- **SkeletonThemeProvider**: Only handles skeleton theme configuration
- **MonsterCardSkeleton**: Only displays loading state for monster cards
- **AccessoryCardSkeleton**: Only displays loading state for accessory cards
- **QuestCardSkeleton**: Only displays loading state for quest cards
- **StatsCardSkeleton**: Only displays loading state for stats cards

Each skeleton component has one reason to change: when the visual structure of its corresponding content component changes.

#### 2. Open/Closed Principle (OCP)
- Skeleton components are open for extension (through props like `count`)
- Closed for modification (new skeleton types don't require changing existing ones)
- Theme configuration is centralized and extensible

#### 3. Interface Segregation Principle (ISP)
- Simple, focused props interfaces (`count?: number`)
- No unused props or bloated interfaces
- Each component exposes only what it needs

#### 4. Dependency Inversion Principle (DIP)
- Components depend on `react-loading-skeleton` abstraction
- Theme configuration is injected at root level
- No direct coupling to specific skeleton implementations

### Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│  Presentation Layer (UI Components)     │
│  - MonsterCard, AccessoryCard, etc.     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Loading States (Skeleton Components)   │
│  - MonsterCardSkeleton                   │
│  - AccessoryCardSkeleton                 │
│  - QuestCardSkeleton                     │
│  - StatsCardSkeleton                     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Infrastructure (react-loading-skeleton)│
│  - SkeletonThemeProvider                 │
│  - Skeleton component                    │
└──────────────────────────────────────────┘
```

## Implementation Details

### 1. Theme Configuration
**File**: `src/components/skeletons/SkeletonThemeProvider.tsx`

```tsx
// Centralized theme matching autumn color palette
<SkeletonTheme
  baseColor='#FAF3E0'      // autumn-cream
  highlightColor='#FFE5D9'  // autumn-peach
  borderRadius='0.75rem'
  duration={1.5}
>
```

**Integrated at**: `src/app/layout.tsx` (root level)

### 2. Skeleton Components

#### MonsterCardSkeleton
**Purpose**: Loading state for monster cards
**Used in**:
- Dashboard (`src/app/dashboard/loading.tsx`)
- Gallery (`src/app/gallery/loading.tsx`)
- Creatures page (`src/app/creatures/loading.tsx`)

**Features**:
- Matches MonsterCard structure
- Supports `count` prop for grid rendering
- Includes state badge, image area, name, and date placeholders

#### AccessoryCardSkeleton
**Purpose**: Loading state for accessory cards
**Used in**:
- Shop page (`src/app/shop/loading.tsx`)

**Features**:
- Matches AccessoryCard structure
- Rarity badge, image, name, price, and button placeholders
- Respects shop grid layout

#### QuestCardSkeleton
**Purpose**: Loading state for quest cards
**Used in**:
- Dashboard QuestsSection (`src/components/dashboard/QuestsSection.tsx`)
- Quests page (`src/app/quests/loading.tsx`)

**Features**:
- Icon, title, description, progress bar, and action button
- Configurable count for multiple quests

#### StatsCardSkeleton
**Purpose**: Loading state for dashboard statistics
**Used in**:
- Dashboard (`src/app/dashboard/loading.tsx`)

**Features**:
- 4-column grid matching stats layout
- Icon, value, and label for each stat

### 3. Page-Level Loading States

Next.js App Router automatically uses `loading.tsx` files for Suspense boundaries:

- **Home**: `src/app/loading.tsx`
- **Dashboard**: `src/app/dashboard/loading.tsx`
- **Gallery**: `src/app/gallery/loading.tsx`
- **Shop**: `src/app/shop/loading.tsx`
- **Quests**: `src/app/quests/loading.tsx`
- **Creatures**: `src/app/creatures/loading.tsx`
- **Wallet**: `src/app/wallet/loading.tsx`

### 4. Real-Time Loading Indicator

**MonsterCard Polling**: Added visual feedback during auto-refresh
```tsx
const { monster, isLoading } = useMonsterPolling({ ... })

{isLoading && (
  <div className='absolute inset-0 bg-white/50 backdrop-blur-[1px]'>
    <div className='animate-spin text-2xl'>⏳</div>
  </div>
)}
```

## Clean Code Practices

### 1. Meaningful Names
- `MonsterCardSkeleton` clearly indicates it's a skeleton for MonsterCard
- `SkeletonThemeProvider` describes its role as a theme provider
- Function names are descriptive: `MonsterCardSkeletonItem`

### 2. Small, Focused Functions
- Each skeleton component is ~50 lines
- Single responsibility per component
- Helper functions for repeated patterns

### 3. DRY Principle
- Centralized theme configuration
- Reusable skeleton components
- Barrel exports (`index.ts`) for clean imports

### 4. Composition Over Inheritance
- Skeletons compose `Skeleton` component from library
- No class hierarchies or complex inheritance
- Props-based customization

## Usage Examples

### Basic Skeleton
```tsx
import { MonsterCardSkeleton } from '@/components/skeletons'

<MonsterCardSkeleton count={3} />
```

### In Loading State
```tsx
if (loading) {
  return (
    <div className='card-cozy'>
      <QuestCardSkeleton count={3} />
    </div>
  )
}
```

### Page-Level Loading
```tsx
// src/app/mypage/loading.tsx
import { MonsterCardSkeleton } from '@/components/skeletons'

export default function MyPageLoading() {
  return (
    <AppLayout>
      <MonsterCardSkeleton count={6} />
    </AppLayout>
  )
}
```

## Benefits

### User Experience
- ✅ Visual feedback during loading
- ✅ Reduces perceived load time
- ✅ Maintains layout stability (no content shift)
- ✅ Professional, polished appearance

### Developer Experience
- ✅ Reusable skeleton components
- ✅ Easy to maintain and extend
- ✅ Consistent with design system
- ✅ Type-safe TypeScript implementation

### Performance
- ✅ Lightweight library (3.5KB gzipped)
- ✅ CSS-based animations
- ✅ No additional API calls
- ✅ Automatic code splitting with Next.js

## Maintenance Guide

### Adding a New Skeleton

1. **Create Component**
   ```tsx
   // src/components/skeletons/NewComponentSkeleton.tsx
   export function NewComponentSkeleton({ count = 1 }) {
     return (
       // Match structure of actual component
     )
   }
   ```

2. **Export from Index**
   ```tsx
   // src/components/skeletons/index.ts
   export { NewComponentSkeleton } from './NewComponentSkeleton'
   ```

3. **Use in Loading State**
   ```tsx
   if (loading) {
     return <NewComponentSkeleton count={3} />
   }
   ```

### Updating Skeleton for Component Changes

When a component's structure changes:
1. Open corresponding skeleton component
2. Update placeholder structure to match
3. Maintain prop interface compatibility
4. Test visual alignment

### Theme Customization

To update skeleton colors:
1. Edit `SkeletonThemeProvider.tsx`
2. Update `baseColor` and `highlightColor`
3. Changes apply globally

## Testing Checklist

- [ ] All page-level loading states display correctly
- [ ] Skeletons match actual component dimensions
- [ ] No layout shift when content loads
- [ ] Responsive behavior works on mobile/desktop
- [ ] Theme colors match design system
- [ ] Loading indicators don't interfere with interactions
- [ ] Accessibility: screen readers handle loading states

## Resources

- [react-loading-skeleton Documentation](https://github.com/dvtng/react-loading-skeleton)
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Skeleton Screen Best Practices](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)
