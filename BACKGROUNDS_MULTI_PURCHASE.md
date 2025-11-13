# Backgrounds - Multi-Purchase & Single-Use Implementation

## Overview
This document describes the implementation of the new background system where users can purchase multiple instances of the same background, but each instance can only be equipped once.

## Key Changes

### 1. Database Model (`src/db/models/background.model.ts`)

#### `purchaseBackground()`
- **Removed**: Duplicate ownership check
- **New behavior**: Users can now purchase the same background multiple times
- Each purchase creates a unique instance in the database with a unique `_id`

```typescript
// Before: Blocked duplicate purchases
if (existing != null) {
  throw new Error('Background déjà possédé')
}

// After: Allows multiple purchases
// Users can now purchase the same background multiple times
// Each purchase creates a unique owned instance
```

#### `userOwnsBackground()`
- **Updated**: Now checks for unequipped instances only
- **Purpose**: Determines if a user has an available (unequipped) instance
- Used to validate if a background can be equipped

```typescript
// Now filters by equippedTo: null
const doc = await collection.findOne({
  userId,
  backgroundId,
  equippedTo: null // Only count unequipped backgrounds as available
})
```

### 2. Server Actions (`src/actions/backgrounds.actions.ts`)

#### `purchaseBackground()`
- **Removed**: `alreadyOwned` check
- **New behavior**: Allows purchasing the same background multiple times
- Each purchase creates a new database entry

```typescript
// 4. Users can now purchase the same background multiple times
// Each purchase creates a unique instance that can be equipped separately
```

### 3. UI Component (`src/components/backgrounds/BackgroundPanel.tsx`)

#### New Features

##### a) Available Backgrounds Filter
- Added `availableBackgrounds` computed state
- Filters out backgrounds that are already equipped (`equippedTo != null`)
- Only unequipped instances are shown in the selection modal

```typescript
const availableBackgrounds = ownedBackgrounds.filter(bg => bg.equippedTo == null)
```

##### b) Shop Button in Modal
- Added a "Acheter plus de backgrounds" button at the top of the modal
- Always visible when backgrounds are available
- Direct link to `/shop` for purchasing more instances

##### c) Compact Design
- Reduced padding from `p-6` to `p-4`
- Moved action buttons to header for quick access
- Smaller preview (64x64px) instead of full aspect-square
- Horizontal layout instead of vertical
- Reduced margins between elements

#### Before vs After Layout

**Before:**
```
┌─────────────────────────┐
│  🖼️ Background          │
│  Personnalisez...       │
│                         │
│  ┌───────────────────┐ │
│  │                   │ │
│  │   Large Preview   │ │
│  │                   │ │
│  └───────────────────┘ │
│  Name                  │
│  Description           │
│  [Retirer]             │
│                         │
│  [Choisir un bg (X)]   │
└─────────────────────────┘
```

**After:**
```
┌─────────────────────────┐
│ 🖼️ Background           │
│         [Retirer][Changer]│
│                         │
│ ┌─┐ Name               │
│ └─┘ Description        │
└─────────────────────────┘
```

## Business Rules

### Purchase Rules
1. ✅ Users can purchase the same background multiple times
2. ✅ Each purchase costs the full price (no discount)
3. ✅ Each purchase creates a unique owned instance

### Equip Rules
1. ✅ Each background instance can only be equipped to one monster
2. ✅ Once equipped, the instance is removed from available backgrounds
3. ✅ Only unequipped instances are shown in the selection modal
4. ✅ Unequipping releases the instance back to the available pool

### UI Rules
1. ✅ Counter shows only available (unequipped) backgrounds
2. ✅ Shop button is always accessible in the modal
3. ✅ Compact design prioritizes quick access to actions
4. ✅ Clear messaging when all instances are equipped

## Architecture Compliance

### SOLID Principles

#### Single Responsibility (S)
- ✅ `BackgroundPanel`: UI orchestration only
- ✅ Database model: Persistence logic only
- ✅ Actions: Business logic coordination only

#### Open/Closed (O)
- ✅ Extended background behavior without modifying core interfaces
- ✅ Added new features through composition (availableBackgrounds filter)

#### Liskov Substitution (L)
- ✅ All BackgroundDB types remain compatible
- ✅ No breaking changes to existing interfaces

#### Interface Segregation (I)
- ✅ Kept interfaces focused and minimal
- ✅ No unnecessary dependencies added

#### Dependency Inversion (D)
- ✅ Component depends on actions abstraction
- ✅ Actions depend on database model abstraction

### Clean Code Practices

1. **Meaningful Names**
   - `availableBackgrounds`: Clear intent (unequipped instances)
   - `userOwnsBackground`: Updated comment to reflect new behavior

2. **Small Functions**
   - Each function maintains single responsibility
   - No function exceeds 20 lines of core logic

3. **Self-Documenting Code**
   - Comments explain "why" (business rules)
   - Code structure explains "what" and "how"

4. **Error Handling**
   - Maintains existing error handling patterns
   - Type-safe operations throughout

### Clean Architecture

1. **Layer Separation**
   - ✅ UI (BackgroundPanel) → Actions → Database Model
   - ✅ Clear boundaries maintained
   - ✅ Dependencies point inward

2. **Data Flow**
   - ✅ Unidirectional: Props down, events up
   - ✅ State management localized to component

## Testing Scenarios

### Scenario 1: Purchase Multiple Instances
```
Given: User has 100 Koins
When: User purchases "bg-autumn-forest" twice
Then: User has 2 instances of "bg-autumn-forest"
And: User has 100 - (2 × price) Koins
```

### Scenario 2: Equip First Instance
```
Given: User has 2 instances of "bg-autumn-forest"
When: User equips one instance to Monster A
Then: availableBackgrounds shows 1 instance
And: Monster A displays "bg-autumn-forest"
```

### Scenario 3: Equip Second Instance
```
Given: User has 1 available instance (1 already equipped)
When: User equips the second instance to Monster B
Then: availableBackgrounds shows 0 instances
And: Monster A and B both display "bg-autumn-forest"
```

### Scenario 4: Unequip Instance
```
Given: All instances are equipped
When: User unequips from Monster A
Then: availableBackgrounds shows 1 instance
And: That instance can be equipped elsewhere
```

### Scenario 5: No Available Backgrounds
```
Given: User has backgrounds but all are equipped
When: User opens background modal
Then: "Aucun background disponible" message shown
And: Shop button is prominently displayed
```

## Migration Notes

### Database Migration
No migration needed! The existing schema already supports this:
- Each background has a unique `_id` (MongoDB ObjectId)
- `backgroundId` field identifies the catalog background
- Multiple documents can have the same `backgroundId` but different `_id`

### Backward Compatibility
✅ Fully backward compatible:
- Users who purchased backgrounds before this change are unaffected
- They can now purchase duplicates if they want more instances
- Existing equipped backgrounds continue to work

## Future Enhancements

### Potential Features
1. **Bundle Purchases**: Buy 3 instances at a discount
2. **Inventory View**: Dedicated page to manage all owned backgrounds
3. **Transfer System**: Move backgrounds between monsters
4. **Background Sets**: Purchase themed sets of backgrounds
5. **Limited Editions**: Backgrounds with purchase limits

### UI Improvements
1. **Visual Indicator**: Show equipped count in shop (e.g., "Owned: 2 (1 equipped)")
2. **Quick Equip**: Drag-and-drop backgrounds to monsters
3. **Preview Mode**: See background on monster before purchasing
4. **Sorting Options**: Sort by rarity, name, or availability

## Related Files

### Modified Files
- `src/db/models/background.model.ts`
- `src/actions/backgrounds.actions.ts`
- `src/components/backgrounds/BackgroundPanel.tsx`

### Related Documentation
- `BACKGROUNDS_SYSTEM.md` - Main background system documentation
- `DESIGN_SYSTEM.md` - UI/UX design principles
- `SHOP_SYSTEM.md` - Shop and purchase flow

## Summary

This implementation successfully transforms the background system to support:
- ✅ Multiple purchases of the same background
- ✅ Single-use per instance (each can only be equipped once)
- ✅ Clear UI showing available vs equipped instances
- ✅ Easy access to shop for purchasing more
- ✅ Compact, action-focused design

All changes respect SOLID principles, clean code practices, and clean architecture guidelines.
