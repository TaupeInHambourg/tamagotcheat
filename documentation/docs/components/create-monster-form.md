---
sidebar_position: 4
---

# Create Monster Form

Complete form component for creating new monsters.

## Overview

The `CreateMonsterForm` component provides a complete user interface for creating new virtual pet monsters. It includes template selection, color customization, and validation.

**Location**: `src/components/forms/CreateMonsterForm.tsx`

## Basic Usage

```tsx
import { CreateMonsterForm } from '@/components/forms/CreateMonsterForm'

function CreateMonsterPage() {
  return (
    <div className="container mx-auto p-4">
      <h1>Create Your Monster</h1>
      <CreateMonsterForm />
    </div>
  )
}
```

## Features

### Template Selection
- Visual grid of available monster templates
- Preview of each monster design
- Template names and descriptions
- Single selection with radio button behavior

### Name Input
- Text input with validation
- Character limit (3-20 characters)
- Real-time validation feedback
- Uniqueness check (optional)

### Color Picker
- Color selection for monster customization
- Pre-defined color palette
- Visual preview of selected color
- Hex color input option

### Form Validation
- Client-side validation
- Server-side validation
- Error message display
- Submit button state management

## Props

```typescript
interface CreateMonsterFormProps {
  onSuccess?: (monster: IMonster) => void
  onError?: (error: string) => void
  redirectOnSuccess?: boolean
}
```

### Prop Details

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `(monster: IMonster) => void` | - | Called after successful creation |
| `onError` | `(error: string) => void` | - | Called on error |
| `redirectOnSuccess` | `boolean` | `true` | Redirect to creature page after creation |

## Form Structure

```tsx
<form onSubmit={handleSubmit}>
  {/* Template Selection */}
  <div className="template-grid">
    {templates.map((template) => (
      <TemplateCard
        key={template.id}
        template={template}
        selected={selectedTemplate === template.id}
        onSelect={() => setSelectedTemplate(template.id)}
      />
    ))}
  </div>

  {/* Name Input */}
  <Input
    label="Monster Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    error={nameError}
    maxLength={20}
    required
  />

  {/* Color Picker */}
  <ColorPicker
    value={color}
    onChange={setColor}
  />

  {/* Description (Optional) */}
  <Textarea
    label="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    maxLength={200}
  />

  {/* Submit Button */}
  <Button
    type="submit"
    disabled={isSubmitting || !isValid}
  >
    {isSubmitting ? 'Creating...' : 'Create Monster'}
  </Button>
</form>
```

## Validation Rules

### Name Validation
```typescript
const validateName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Name is required'
  }
  if (name.length < 3) {
    return 'Name must be at least 3 characters'
  }
  if (name.length > 20) {
    return 'Name must be at most 20 characters'
  }
  if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
    return 'Name can only contain letters, numbers, spaces, and hyphens'
  }
  return null
}
```

### Template Validation
```typescript
const validateTemplate = (templateId: string | null): string | null => {
  if (!templateId) {
    return 'Please select a monster template'
  }
  return null
}
```

## Complete Example

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMonster } from '@/actions/monsters.actions'
import { CreateMonsterForm } from '@/components/forms/CreateMonsterForm'
import { toast } from 'sonner'

export default function CreateMonsterPage() {
  const router = useRouter()

  const handleSuccess = (monster: IMonster) => {
    toast.success(`${monster.name} has been created!`)
    router.push(`/creatures/${monster._id}`)
  }

  const handleError = (error: string) => {
    toast.error(error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Create Your Monster
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <CreateMonsterForm
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Server Action Integration

The form uses server actions for data submission:

```typescript
// src/actions/monsters.actions.ts
'use server'

export async function createMonster(
  data: CreateMonsterData
): Promise<OperationResult<IMonster>> {
  try {
    // Validate user authentication
    const session = await auth()
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Authentication required'
      }
    }

    // Validate input data
    const validationError = validateMonsterData(data)
    if (validationError) {
      return {
        success: false,
        error: validationError
      }
    }

    // Create monster
    const monster = await MonsterService.create({
      ...data,
      userId: session.user.id
    })

    revalidatePath('/dashboard')
    revalidatePath('/creatures')

    return {
      success: true,
      data: monster
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create monster'
    }
  }
}
```

## Form State Management

```tsx
function CreateMonsterForm() {
  // Form state
  const [name, setName] = useState('')
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [color, setColor] = useState('#bce5c3')
  const [description, setDescription] = useState('')

  // Validation state
  const [nameError, setNameError] = useState<string | null>(null)
  const [templateError, setTemplateError] = useState<string | null>(null)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Computed validation
  const isValid = useMemo(() => {
    return (
      name.length >= 3 &&
      templateId !== null &&
      !nameError &&
      !templateError
    )
  }, [name, templateId, nameError, templateError])

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid || isSubmitting) return

    setIsSubmitting(true)

    try {
      const result = await createMonster({
        name,
        templateId: templateId!,
        color,
        description
      })

      if (result.success) {
        onSuccess?.(result.data!)
      } else {
        setError(result.error)
        onError?.(result.error)
      }
    } catch (error) {
      const message = 'An unexpected error occurred'
      setError(message)
      onError?.(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## Accessibility

The form follows accessibility best practices:

- ✅ Proper label associations
- ✅ Error announcements with ARIA
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support

```tsx
<form
  onSubmit={handleSubmit}
  aria-label="Create Monster Form"
  noValidate
>
  <Input
    id="monster-name"
    label="Monster Name"
    value={name}
    onChange={handleNameChange}
    error={nameError}
    aria-invalid={!!nameError}
    aria-describedby={nameError ? 'name-error' : undefined}
    required
  />
  {nameError && (
    <span id="name-error" role="alert" className="text-red-500">
      {nameError}
    </span>
  )}
</form>
```

## Best Practices

### Do's
✅ Validate input on both client and server  
✅ Provide clear error messages  
✅ Show loading states during submission  
✅ Prevent multiple submissions  
✅ Handle all error cases  
✅ Provide visual feedback  

### Don'ts
❌ Don't trust client-side validation alone  
❌ Don't show all errors at once initially  
❌ Don't block submission without clear reason  
❌ Don't forget to handle network errors  
❌ Don't redirect before confirmation  

## Related Components

- [Input](./input) - Form input fields
- [Button](./button) - Submit button
- [Modal](./modal) - Form in modal context

## Real-World Usage

The CreateMonsterForm is used in:
- `/dashboard` - Main monster creation page
- Modals - Quick monster creation
- Onboarding - First-time user experience

## Future Enhancements

- [ ] Add preview of monster with selected options
- [ ] Save draft functionality
- [ ] Template search and filtering
- [ ] Advanced customization options
- [ ] Import/export monster designs
