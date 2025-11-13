---
sidebar_position: 1
---

# Components Overview

TamagoTcheat uses a modular component architecture with reusable, composable components following SOLID principles.

## Component Principles

### 🎯 Single Responsibility
Each component has one clear purpose and reason to change.

### 🔧 Composability
Components use composition patterns (render props, children) for flexibility.

### 📝 Type Safety
All components have comprehensive TypeScript interfaces.

### 🎨 Consistent Design
Components follow the autumn/cozy design system with TailwindCSS.

### ♻️ Reusability
Generic components (ShopCard, BaseSkeleton) reduce code duplication.

## Core Components

### Button
**Location**: `src/components/Button.tsx`

Versatile button with multiple variants and sizes.

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

**Variants**: primary, secondary, ghost, link, outline  
**Sizes**: sm, md, lg, xl

### Input
**Location**: `src/components/Input.tsx`

Styled input field with label support.

```tsx
<Input
  label="Monster Name"
  value={name}
  onChange={setName}
  required
/>
```

### ShopCard (Generic)
**Location**: `src/components/common/ShopCard.tsx`

Reusable card for all shop items using render props pattern.

```tsx
<ShopCard
  item={accessory}
  renderPreview={() => <AccessoryPreview />}
  onPurchase={handlePurchase}
  isOwned={isOwned}
/>
```

**Features**:
- Dual currency display (Koins/Gifts)
- Ownership indicators
- Purchase feedback
- Flexible preview rendering

## Monster Components

### MonsterCard
Display a single monster with details and actions.

```tsx
<MonsterCard
  monster={monster}
  onSelect={handleSelect}
  showActions={true}
/>
```

### MonsterGrid
Responsive grid for displaying multiple monsters.

```tsx
<MonsterGrid
  monsters={monsters}
  onMonsterSelect={handleSelect}
  emptyMessage="No monsters yet"
/>
```

### MonsterPreview
Large preview with accessories and background layering.

```tsx
<MonsterPreview
  monster={monster}
  accessories={equippedAccessories}
  background={selectedBackground}
  size="large"
/>
```

## Accessory Components

### AccessoryCard
Display accessory with purchase/equip options.

```tsx
<AccessoryCard
  accessory={accessory}
  onPurchase={handlePurchase}
  onEquip={handleEquip}
  isOwned={isOwned}
/>
```

### AccessorySlot
Equipment slot for managing monster accessories.

```tsx
<AccessorySlot
  category="hats"
  equipped={currentHat}
  available={availableHats}
  onEquip={handleEquip}
/>
```

## Quest Components

### QuestCard
Display quest with progress and rewards.

```tsx
<QuestCard
  quest={quest}
  progress={userProgress}
  onClaim={handleClaim}
  canClaim={isClaimable}
/>
```

### QuestList
Tabbed list of daily and weekly quests.

```tsx
<QuestList
  dailyQuests={dailyQuests}
  weeklyQuests={weeklyQuests}
  userProgress={progress}
/>
```

## Loading Components

### BaseSkeleton
Base skeleton with reusable patterns.

```tsx
<BaseSkeleton
  count={3}
  renderItem={(index) => (
    <div key={index}>
      {SkeletonPatterns.ImageArea}
      {SkeletonPatterns.Button}
    </div>
  )}
/>
```

**Available Patterns**:
- `Card`: Full card skeleton
- `ImageArea`: Image placeholder
- `Button`: Button skeleton
- `Circle`: Circular skeleton
- `Text`: Text line skeleton

### Specialized Skeletons
- `MonsterCardSkeleton`
- `AccessoryCardSkeleton`
- `QuestCardSkeleton`
- `StatsCardSkeleton`

## Navigation Components

### AppHeader
Main application header with navigation and wallet.

```tsx
<AppHeader
  user={currentUser}
  walletBalance={balance}
/>
```

### LandingHeader
Header for landing page.

```tsx
<LandingHeader />
```

### MobileNav
Bottom navigation bar for mobile devices.

```tsx
<MobileNav activeRoute={pathname} />
```

## Modal Components

### Modal
Base modal component.

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
>
  <p>Modal content</p>
</Modal>
```

### ConfirmModal
Confirmation dialog with actions.

```tsx
<ConfirmModal
  isOpen={isOpen}
  onConfirm={handleConfirm}
  onClose={handleClose}
  title="Delete Monster"
  message="This action cannot be undone"
/>
```

## Component Best Practices

### Type Safety
```tsx
interface ComponentProps {
  /** Required prop with description */
  title: string;
  /** Optional prop with default */
  size?: 'sm' | 'md' | 'lg';
}

export function Component({ title, size = 'md' }: ComponentProps) {
  // Implementation
}
```

### Composition Pattern
```tsx
// ✅ Good: Use composition
<ShopCard renderPreview={() => <CustomPreview />} />

// ❌ Bad: Inheritance
class CustomCard extends ShopCard { }
```

### Naming Conventions
- Components: PascalCase (`MonsterCard`)
- Props: PascalCase + "Props" (`MonsterCardProps`)
- Handlers: camelCase + "handle" (`handleClick`)
- Hooks: camelCase + "use" (`useMonsterState`)

## Component Structure

### Standard Template

```tsx
'use client' // Only for client components

import { type ReactNode } from 'react'

interface ComponentProps {
  children: ReactNode;
  title: string;
}

export function Component({ children, title }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. Handlers
  const handleAction = () => {
    setState(newState)
  }
  
  // 3. Render
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

## Styling Approach

### TailwindCSS Utilities
TailwindCSS 4 with custom autumn/cozy color palette:

```tsx
<button className="
  bg-gradient-to-r
  from-autumn-coral
  to-autumn-cinnamon
  text-white
  px-6 py-3
  rounded-lg
  hover:opacity-90
  transition-all
">
  Button
</button>
```

### Custom Color System
- **autumn-coral**: #FF6B6B
- **autumn-cinnamon**: #CD5C5C
- **autumn-amber**: #FFA500
- **autumn-sage**: #8B9467
- **autumn-cream**: #FFFACD

### Responsive Design
```tsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-4
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Animation Classes
```tsx
<div className="
  animate-pulse        // Loading state
  animate-bounce       // Attention grabber
  transition-all       // Smooth transitions
  hover:scale-105      // Hover effect
">
```

## Performance Optimization

### Server Components by Default
```tsx
// Server Component (default)
export default async function MonsterList() {
  const monsters = await getMonsters()
  return <MonsterGrid monsters={monsters} />
}
```

### Client Components When Needed
```tsx
'use client'

// Only for interactivity
export function MonsterCard({ onClick }) {
  return <div onClick={onClick}>...</div>
}
```

### Image Optimization
```tsx
import Image from 'next/image'

<Image
  src="/monster.svg"
  alt="Monster"
  width={200}
  height={200}
  priority={false}
/>
```

### Lazy Loading
```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<MonsterCardSkeleton />}>
  <HeavyComponent />
</Suspense>
```

## Testing Components

### Component Tests
```tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### Integration Tests
```tsx
test('purchases accessory on click', async () => {
  const handlePurchase = jest.fn()
  render(<AccessoryCard onPurchase={handlePurchase} />)
  
  fireEvent.click(screen.getByText('Buy'))
  expect(handlePurchase).toHaveBeenCalled()
})
```

## Accessibility

### Semantic HTML
```tsx
<nav aria-label="Main navigation">
  <button aria-expanded={isOpen}>Menu</button>
</nav>
```

### Keyboard Navigation
```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>
```

### Screen Reader Support
```tsx
<img
  src="/monster.svg"
  alt="Happy green monster with a hat"
/>

<button aria-label="Close modal">
  <Icon name="close" aria-hidden="true" />
</button>
```

## Related Documentation

- [Architecture](../architecture/clean-architecture.md)
- [Shop System](../features/shop-system.md)
- [Quest System](../features/quest-system.md)
- [Local Development](./local-development.md)
--color-autumn-coral: #ffb499

/* Nature Greens */
--color-moss-soft: #a8c8a8
--color-moss-medium: #7da87d

/* And more... */
```

## State Management

### Local State (useState)

```tsx
const [formData, setFormData] = useState<FormData>({
  name: '',
  templateId: 'chat-cosmique'
})
```

### Form Handling

```tsx
const handleSubmit = (e: React.FormEvent): void => {
  e.preventDefault()
  
  try {
    validateForm(formData)
    onSubmit(formData)
  } catch (error) {
    handleError(error)
  }
}
```

## Accessibility

### ARIA Labels

```tsx
<button
  aria-label="Close modal"
  aria-disabled={disabled}
>
  ×
</button>
```

### Keyboard Navigation

```tsx
<input
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') handleCancel()
  }}
/>
```

### Focus Management

```tsx
<button
  className='focus:ring-4 focus:ring-autumn-coral/20'
  autoFocus={isFirst}
>
  Submit
</button>
```

## Component Testing

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('applies correct variant styles', () => {
    render(<Button variant="primary">Button</Button>)
    const button = screen.getByText('Button')
    
    expect(button).toHaveClass('bg-gradient-to-r')
  })
})
```

## Best Practices

### ✅ DO

- Use TypeScript for all props
- Add JSDoc comments
- Follow naming conventions
- Extract reusable logic
- Handle errors gracefully
- Support dark mode (when applicable)
- Make components accessible

### ❌ DON'T

- Mix business logic with UI
- Access database directly
- Use inline styles
- Forget error boundaries
- Ignore accessibility
- Create giant components

## File Organization

```
src/components/
├── Button/
│   ├── Button.tsx           # Main component
│   ├── button.styles.ts     # Style logic
│   ├── button.types.ts      # Type definitions
│   └── index.ts             # Barrel export
├── forms/
│   ├── create-monster-form.tsx
│   └── signin-form.tsx
├── modals/
│   └── create-monster-modal.tsx
└── home/
    ├── HeroSection.tsx
    └── FeaturesSection.tsx
```

## Next Steps

- [Button Component](./button) - Detailed button documentation
- [Form Components](./create-monster-form) - Form patterns
- [Design System](../design/colors) - Visual guidelines
