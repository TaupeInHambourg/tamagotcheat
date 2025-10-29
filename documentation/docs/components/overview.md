---
sidebar_position: 1
---

# Components Overview

Tamagotcheat follows a component-driven architecture with reusable, well-documented UI components.

## Component Principles

### 🎯 Single Responsibility
Each component has one clear purpose.

### 🔧 Composability
Components can be combined to create complex UIs.

### 📝 Documentation
All components have comprehensive JSDoc comments.

### 🎨 Theming
Components follow the autumn/cozy design system.

## Component Categories

### Core UI Components

#### [Button](./button)
Primary interaction component with multiple variants and sizes.

```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

#### [Input](./input)
Form input with label, error handling, and validation.

```tsx
<InputField
  label="Monster Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={error}
  required
/>
```

### Form Components

#### [CreateMonsterForm](./create-monster-form)
Complete form for creating new monsters with validation.

```tsx
<CreateMonsterForm
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

### Layout Components

#### [Header](./header)
Landing page header with navigation and CTA.

#### [Footer](./footer)
Site footer with links and information.

### Modal Components

#### [CreateMonsterModal](./modal)
Modal dialog for monster creation.

```tsx
<CreateMonsterModal
  isOpen={isOpen}
  onClose={handleClose}
  onSubmit={handleSubmit}
/>
```

## Component Structure

### Standard Component Template

```tsx
/**
 * Component Name
 *
 * Brief description of what the component does.
 *
 * Features:
 * - Feature 1
 * - Feature 2
 *
 * @component
 */

'use client' // If client component

import { useState } from 'react'

/**
 * Props for the Component
 */
interface ComponentProps {
  /** Prop description */
  propName: string
  /** Optional prop */
  optionalProp?: boolean
}

export default function Component({
  propName,
  optionalProp = false
}: ComponentProps): React.ReactNode {
  // Implementation
  return <div>{/* JSX */}</div>
}
```

## Styling Approach

### TailwindCSS Utilities

We use TailwindCSS 4 with custom color system:

```tsx
<button className='
  bg-gradient-to-r
  from-autumn-coral
  to-autumn-cinnamon
  text-white
  rounded-xl
  px-6 py-3
  hover:shadow-lg
  transition-all
'>
  Button
</button>
```

### Design Tokens

```css
/* Autumn Colors */
--color-autumn-cream: #fef9f5
--color-autumn-peach: #ffd4b8
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
