---
sidebar_position: 3
---

# Modal Component

Dialog component for displaying content in an overlay.

## Overview

The `Modal` component provides a flexible dialog system for displaying content, forms, and confirmations in a modal overlay.

**Location**: `src/components/modals/` (various modal components)

## Basic Usage

```tsx
'use client'

import { useState } from 'react'
import { Modal } from '@/components/modals/Modal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  )
}
```

## Props

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}
```

### Prop Details

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Called when modal should close |
| `title` | `string` | - | Modal title text |
| `children` | `ReactNode` | - | Modal content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal width |
| `showCloseButton` | `boolean` | `true` | Show X button |
| `closeOnOverlayClick` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on ESC key |

## Examples

### Simple Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Welcome"
>
  <p>Welcome to TamagoTcheat!</p>
</Modal>
```

### Form Modal

```tsx
function CreateMonsterModal({ isOpen, onClose }: Props) {
  const handleSubmit = async (data: MonsterData) => {
    // Create monster
    await createMonster(data)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Monster"
      size="lg"
    >
      <CreateMonsterForm onSubmit={handleSubmit} />
    </Modal>
  )
}
```

### Confirmation Modal

```tsx
function ConfirmDeleteModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete"
      size="sm"
    >
      <div className="space-y-4">
        <p>Are you sure you want to delete this monster?</p>
        <p className="text-sm text-gray-500">
          This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
```

### Different Sizes

```tsx
{/* Small */}
<Modal size="sm" {...props}>
  Small modal content
</Modal>

{/* Medium (default) */}
<Modal size="md" {...props}>
  Medium modal content
</Modal>

{/* Large */}
<Modal size="lg" {...props}>
  Large modal content
</Modal>

{/* Extra Large */}
<Modal size="xl" {...props}>
  Extra large modal content
</Modal>
```

## Modal Types in TamagoTcheat

### Purchase Modal

Used in the shop for item purchases:

```tsx
<PurchaseModal
  isOpen={isOpen}
  onClose={onClose}
  item={selectedItem}
  onPurchase={handlePurchase}
/>
```

### Equipment Modal

Used for equipping accessories:

```tsx
<EquipmentModal
  isOpen={isOpen}
  onClose={onClose}
  monster={monster}
  accessories={availableAccessories}
/>
```

### Delete Confirmation Modal

Used for destructive actions:

```tsx
<DeleteConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  itemName={itemName}
  onConfirm={handleDelete}
/>
```

## Behavior

### Opening/Closing

```tsx
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  // Open modal
  const openModal = () => setIsOpen(true)

  // Close modal
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <button onClick={openModal}>Open</button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        Content
      </Modal>
    </>
  )
}
```

### Preventing Close

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  closeOnOverlayClick={false}
  closeOnEscape={false}
  showCloseButton={false}
>
  <p>This modal must be completed</p>
  <Button onClick={handleComplete}>Complete</Button>
</Modal>
```

### Nested Modals

```tsx
function ParentModal() {
  const [showChild, setShowChild] = useState(false)

  return (
    <Modal isOpen={true} onClose={onClose}>
      <p>Parent modal content</p>
      <Button onClick={() => setShowChild(true)}>
        Open Child Modal
      </Button>

      <Modal
        isOpen={showChild}
        onClose={() => setShowChild(false)}
        title="Child Modal"
      >
        <p>Child modal content</p>
      </Modal>
    </Modal>
  )
}
```

## Styling

Modals use TailwindCSS with custom animations:

```tsx
// Overlay fade in/out
// Modal slide in/out
// Backdrop blur effect
```

## Accessibility

The Modal component follows accessibility best practices:

- ✅ Focus trapping within modal
- ✅ Return focus on close
- ✅ ESC key to close
- ✅ ARIA attributes (`role="dialog"`, `aria-modal`)
- ✅ Screen reader announcements

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Accessible Modal"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Title</h2>
  <p id="modal-description">Description</p>
</Modal>
```

## Best Practices

### Do's
✅ Always provide a way to close the modal  
✅ Use appropriate sizes for content  
✅ Keep modal content focused  
✅ Handle form submission properly  
✅ Prevent body scroll when open  

### Don'ts
❌ Don't nest too many modals  
❌ Don't show critical info only in modals  
❌ Don't make modals too large  
❌ Don't forget loading states  
❌ Don't block all close methods without reason  

## Integration with Forms

```tsx
function FormModal({ isOpen, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await submitForm(data)
      onClose()
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Modal>
  )
}
```

## Related Components

- [Button](./button) - Action buttons in modals
- [Input](./input) - Form inputs in modals
- [Forms](./create-monster-form) - Complete form examples

## Future Enhancements

- [ ] Add animation customization
- [ ] Support for fullscreen mode
- [ ] Add side drawer variant
- [ ] Improve mobile experience
- [ ] Add modal stacking management
