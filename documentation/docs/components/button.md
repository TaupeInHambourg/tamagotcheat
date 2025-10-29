---
sidebar_position: 2
---

# Button Component

The `Button` component is a reusable, accessible button with multiple variants and sizes.

## Location

`src/components/Button/Button.tsx`

## Features

- 🎨 **5 Visual Variants**: primary, secondary, ghost, link, outline
- 📏 **4 Size Options**: sm, md, lg, xl
- ♿ **Accessible**: Full ARIA support
- 🎯 **Type Safe**: Complete TypeScript definitions
- 🎭 **Disabled State**: Visual and functional
- ✨ **Hover Effects**: Smooth transitions

## Basic Usage

```tsx
import { Button } from '@/components/Button'

export default function MyComponent() {
  return (
    <Button
      variant="primary"
      size="md"
      onClick={() => console.log('Clicked!')}
    >
      Click Me
    </Button>
  )
}
```

## Props API

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'outline'
  
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  
  /** Disabled state */
  disabled?: boolean
  
  /** Button content */
  children: React.ReactNode
  
  /** Click handler */
  onClick?: () => void
  
  /** Additional CSS classes */
  className?: string
  
  /** Button type */
  type?: 'button' | 'submit' | 'reset'
}
```

## Variants

### Primary (Default)

Gradient background with autumn colors. Main call-to-action button.

```tsx
<Button variant="primary">
  Create Monster
</Button>
```

**Visual**: Autumn coral to cinnamon gradient, white text, shadow on hover.

### Secondary

Outline style with transparent background.

```tsx
<Button variant="secondary">
  Learn More
</Button>
```

**Visual**: Autumn coral border, coral text, white background.

### Ghost

No background, minimal styling.

```tsx
<Button variant="ghost">
  Cancel
</Button>
```

**Visual**: Transparent background, hover shows light background.

### Link

Styled like a hyperlink.

```tsx
<Button variant="link">
  View Details
</Button>
```

**Visual**: Text-only with underline on hover.

### Outline

Similar to secondary with different styling.

```tsx
<Button variant="outline">
  Optional Action
</Button>
```

**Visual**: Border with transparent background.

## Sizes

### Small (sm)

```tsx
<Button size="sm">Small</Button>
```

**Dimensions**: `px-3 py-1.5 text-sm`

### Medium (md) - Default

```tsx
<Button size="md">Medium</Button>
```

**Dimensions**: `px-4 py-2 text-base`

### Large (lg)

```tsx
<Button size="lg">Large</Button>
```

**Dimensions**: `px-6 py-3 text-lg`

### Extra Large (xl)

```tsx
<Button size="xl">Extra Large</Button>
```

**Dimensions**: `px-8 py-4 text-xl`

## Disabled State

```tsx
<Button disabled>
  Cannot Click
</Button>
```

**Behavior**:
- Reduced opacity (50%)
- Pointer events disabled
- Cursor changes to not-allowed
- ARIA `aria-disabled="true"`

## Advanced Examples

### Loading State

```tsx
function SubmitButton() {
  const [loading, setLoading] = useState(false)
  
  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true)
        await submitForm()
        setLoading(false)
      }}
    >
      {loading ? 'Submitting...' : 'Submit'}
    </Button>
  )
}
```

### Icon Button

```tsx
import { PlusIcon } from '@heroicons/react/24/outline'

<Button variant="primary" size="sm">
  <PlusIcon className="w-5 h-5 mr-2" />
  Add Monster
</Button>
```

### Full Width

```tsx
<Button className="w-full">
  Full Width Button
</Button>
```

### Custom Colors

```tsx
<Button
  variant="ghost"
  className="text-creature-pink hover:bg-creature-pink/10"
>
  Custom Color
</Button>
```

## Accessibility

### Keyboard Support

- **Enter/Space**: Activates button
- **Tab**: Focuses button
- **Disabled**: Not focusable

### Screen Readers

```tsx
<Button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
>
  ×
</Button>
```

### Focus Indicator

All buttons have visible focus rings:

```css
focus:ring-4 focus:ring-autumn-coral/20
```

## Implementation Details

### File Structure

```
src/components/Button/
├── Button.tsx           # Main component
├── button.styles.ts     # Style logic (getVariantClasses, getSizeClasses)
├── button.types.ts      # TypeScript definitions
└── index.ts             # Barrel exports
```

### Style Separation (OCP)

Styles are extracted into `button.styles.ts`:

```typescript
/**
 * Get CSS classes for button variant
 */
export function getVariantClasses(variant: Variant): string {
  const variants: Record<Variant, string> = {
    primary: 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon...',
    secondary: 'border-2 border-autumn-coral...',
    // ...
  }
  return variants[variant]
}
```

**Benefits**:
- Easy to add new variants
- Testable in isolation
- Follows Open/Closed Principle

### Type Safety

All props are strongly typed in `button.types.ts`:

```typescript
export type Variant = 'primary' | 'secondary' | 'ghost' | 'link' | 'outline'
export type Size = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  disabled?: boolean
  children: React.ReactNode
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click</Button>)
    const button = screen.getByText('Click')
    expect(button).toHaveClass('bg-gradient-to-r')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('prevents clicks when disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies size classes correctly', () => {
    render(<Button size="xl">Large Button</Button>)
    expect(screen.getByText('Large Button')).toHaveClass('px-8', 'py-4')
  })
})
```

## SOLID Principles Applied

### Single Responsibility (S)
Button only handles UI rendering and user interaction.

### Open/Closed (O)
New variants can be added by extending `getVariantClasses` without modifying the component.

### Liskov Substitution (L)
Button extends native `HTMLButtonElement`, maintaining all expected behavior.

### Interface Segregation (I)
Props are minimal and focused. Style logic is separate.

### Dependency Inversion (D)
Component depends on abstractions (types) not concrete implementations.

## Common Patterns

### Form Submission

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="primary">
    Submit Form
  </Button>
</form>
```

### Confirmation Dialog

```tsx
<div className="flex gap-4">
  <Button variant="secondary" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="primary" onClick={onConfirm}>
    Confirm
  </Button>
</div>
```

### Navigation

```tsx
import Link from 'next/link'

<Link href="/dashboard">
  <Button variant="primary">
    Go to Dashboard
  </Button>
</Link>
```

## Best Practices

### ✅ DO
- Use semantic button types (`submit`, `button`, `reset`)
- Provide meaningful labels
- Use correct variant for context
- Add loading states for async actions
- Make clickable area large enough (minimum 44x44px)

### ❌ DON'T
- Use `div` instead of `button`
- Forget disabled state for loading
- Make buttons too small
- Use links styled as buttons (use Link + Button instead)
- Ignore accessibility attributes

## Related Components

- [Input](./input) - Form input fields
- [Modal](./modal) - Dialog with buttons
- [Forms](./create-monster-form) - Complete form examples
