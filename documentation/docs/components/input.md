---
sidebar_position: 2
---

# Input Component

Text input field component with validation and styling variants.

## Overview

The `Input` component provides a styled text input field with support for different types, validation states, and helper text.

**Location**: `src/components/Input.tsx`

## Basic Usage

```tsx
import { Input } from '@/components/Input'

function MyForm() {
  const [value, setValue] = useState('')

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter your name"
    />
  )
}
```

## Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'outline'
  fullWidth?: boolean
}
```

### Prop Details

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text displayed above input |
| `error` | `string` | - | Error message to display |
| `helperText` | `string` | - | Helper text below input |
| `variant` | `'default' \| 'outline'` | `'default'` | Visual style variant |
| `fullWidth` | `boolean` | `false` | If true, input takes full width |
| ...rest | `InputHTMLAttributes` | - | All standard input props |

## Examples

### With Label

```tsx
<Input
  label="Monster Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter a name"
/>
```

### With Error

```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```

### With Helper Text

```tsx
<Input
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  helperText="3-20 characters, alphanumeric only"
/>
```

### Full Width

```tsx
<Input
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  fullWidth
/>
```

### Different Types

```tsx
{/* Email */}
<Input
  type="email"
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

{/* Password */}
<Input
  type="password"
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

{/* Number */}
<Input
  type="number"
  label="Age"
  value={age}
  onChange={(e) => setAge(e.target.value)}
  min={0}
  max={150}
/>
```

## Styling

The Input component uses TailwindCSS and follows the design system color palette.

### Default Variant

```tsx
<Input variant="default" />
```

### Outline Variant

```tsx
<Input variant="outline" />
```

## Validation

### Basic Validation

```tsx
function ValidatedInput() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (newValue.length < 3) {
      setError('Must be at least 3 characters')
    } else {
      setError('')
    }
  }

  return (
    <Input
      value={value}
      onChange={handleChange}
      error={error}
    />
  )
}
```

### With Form Validation

```tsx
import { useForm } from 'react-hook-form'

function FormWithValidation() {
  const { register, formState: { errors } } = useForm()

  return (
    <form>
      <Input
        label="Name"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
      />
    </form>
  )
}
```

## Accessibility

The Input component follows accessibility best practices:

- ✅ Proper label association with `htmlFor`
- ✅ ARIA attributes for error states
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

```tsx
<Input
  id="monster-name"
  label="Monster Name"
  aria-describedby="name-helper"
  aria-invalid={!!error}
  helperText="Choose a unique name for your monster"
/>
```

## Best Practices

### Do's
✅ Always provide a label for accessibility  
✅ Use appropriate input types (email, password, number)  
✅ Show clear error messages  
✅ Provide helpful placeholder text  
✅ Use helper text for formatting guidelines  

### Don'ts
❌ Don't use placeholder as a label replacement  
❌ Don't show errors before user interaction  
❌ Don't use vague error messages  
❌ Don't skip validation  

## Real-World Usage

The Input component is used throughout TamagoTcheat:

- **Monster Creation**: Name input for new monsters
- **Authentication**: Email/password fields
- **Quest System**: Search and filter inputs
- **Shop**: Item search functionality
- **Settings**: User preference inputs

## Related Components

- [Button](./button) - Form submission buttons
- [Modal](./modal) - Input within dialogs
- [Forms](./create-monster-form) - Complete form examples

## Future Enhancements

- [ ] Add character counter for maxLength
- [ ] Support for input groups (prefix/suffix)
- [ ] Add loading state
- [ ] Icon support (left/right icons)
- [ ] Multi-line textarea variant
