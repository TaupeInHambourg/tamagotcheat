# Toast Notifications with React-Toastify

## Overview

TamagoTcheat uses [react-toastify](https://www.npmjs.com/package/react-toastify) for displaying toast notifications throughout the application. This provides a consistent, customizable notification system.

## Setup

### Installation

Already installed in the project:
```json
"react-toastify": "^11.0.5"
```

### Global Configuration

The `ToastContainer` is configured in the root layout (`src/app/layout.tsx`):

```tsx
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RootLayout({ children }) {
  return (
    <html lang='fr'>
      <body>
        {children}
        <ToastContainer
          position='top-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </body>
    </html>
  )
}
```

## Usage

### Basic Toast

```tsx
import { toast } from 'react-toastify'

// Success notification
toast.success('Monster created successfully!')

// Error notification
toast.error('Failed to save monster')

// Info notification
toast.info('Monster state changed')

// Warning notification
toast.warn('Low health!')
```

### Custom Toast with Options

```tsx
import { toast } from 'react-toastify'

toast.info('Custom notification', {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
})
```

### Toast with Custom Content

```tsx
import { toast } from 'react-toastify'

const CustomContent = () => (
  <div>
    <strong>Custom Title</strong>
    <p>Custom message with JSX</p>
  </div>
)

toast(<CustomContent />, {
  autoClose: 5000
})
```

## Real Example: Monster State Change

In `monster-page-client.tsx`, we use toasts to notify users when a monster's state changes:

```tsx
import { toast } from 'react-toastify'

const { monster } = useMonsterPolling({
  initialMonster,
  onStateChange: (newState, oldState) => {
    const oldEmoji = getMoodEmoji(oldState)
    const newEmoji = getMoodEmoji(newState)
    const newLabel = getStateLabelFr(newState)
    
    toast.info(
      `${newEmoji} ${monster.name} est maintenant ${newLabel.toLowerCase()} ! (${oldEmoji} → ${newEmoji})`,
      {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    )
  }
})
```

## Toast Types

### Available Methods

- `toast()` - Default toast
- `toast.success()` - Success message (green)
- `toast.error()` - Error message (red)
- `toast.warning()` - Warning message (orange)
- `toast.info()` - Info message (blue)
- `toast.dark()` - Dark themed toast

### Promise-based Toast

For async operations:

```tsx
const saveMonster = async () => {
  await toast.promise(
    saveMonsterToDb(),
    {
      pending: 'Saving monster...',
      success: 'Monster saved! 👌',
      error: 'Failed to save monster 🤯'
    }
  )
}
```

## Configuration Options

### Position

- `top-left`
- `top-right` (default)
- `top-center`
- `bottom-left`
- `bottom-right`
- `bottom-center`

### Auto Close

- `false` - Manual close only
- `number` - Milliseconds before auto-close (default: 2000)

### Progress Bar

- `hideProgressBar: false` - Show progress bar (default)
- `hideProgressBar: true` - Hide progress bar

### Theme

- `theme: 'light'` (default)
- `theme: 'dark'`
- `theme: 'colored'`

## Custom Styling

### Override Default Styles

Create a custom CSS file:

```css
/* Custom toast styles */
.Toastify__toast {
  border-radius: 12px;
  font-family: var(--font-geist-sans);
}

.Toastify__toast--success {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.Toastify__progress-bar {
  background: linear-gradient(90deg, #00d4ff, #090979);
}
```

Import in your layout:

```tsx
import './custom-toastify.css'
```

### Inline Custom Styles

```tsx
toast.success('Custom styled toast', {
  className: 'custom-toast',
  bodyClassName: 'custom-toast-body',
  progressClassName: 'custom-progress'
})
```

## Best Practices

### 1. Keep Messages Short

```tsx
// ✅ Good
toast.success('Monster saved!')

// ❌ Too long
toast.success('Your monster has been successfully saved to the database and is now available in your collection')
```

### 2. Use Appropriate Types

```tsx
// ✅ Match action result
toast.success('Deleted')  // For successful deletions
toast.error('Failed')     // For errors
toast.info('Updated')     // For updates/info

// ❌ Wrong type
toast.success('Error occurred')  // Should be toast.error()
```

### 3. Provide Context

```tsx
// ✅ Good - includes context
toast.success(`${monsterName} leveled up!`)

// ❌ Vague
toast.success('Success!')
```

### 4. Don't Spam Toasts

```tsx
// ✅ Good - single toast
const saveMonster = async () => {
  try {
    await api.save()
    toast.success('Saved!')
  } catch {
    toast.error('Failed')
  }
}

// ❌ Bad - multiple toasts
const saveMonster = async () => {
  toast.info('Saving...')
  await api.save()
  toast.success('Saved!')
  toast.info('Refreshing...')
  await refresh()
  toast.success('Done!')
}
```

### 5. Use toast.promise for Async

```tsx
// ✅ Good - automatic state handling
toast.promise(
  saveMonster(),
  {
    pending: 'Saving...',
    success: 'Saved!',
    error: 'Failed'
  }
)

// ❌ Manual - more code
toast.info('Saving...')
try {
  await saveMonster()
  toast.success('Saved!')
} catch {
  toast.error('Failed')
}
```

## Accessibility

React-Toastify includes built-in accessibility features:

- **ARIA roles**: Toasts have proper `role="alert"` attributes
- **Screen reader support**: Messages are announced automatically
- **Keyboard navigation**: Press `Escape` to dismiss
- **Focus management**: Doesn't steal focus from active elements

## Migration from Custom Component

Previously, we used a custom `StateChangeNotification` component. We migrated to `react-toastify` for:

### Benefits

✅ **Standardization** - Industry-standard library
✅ **Less code** - No custom notification component to maintain
✅ **Better UX** - Stacking, positioning, animations built-in
✅ **Accessibility** - ARIA support out of the box
✅ **Consistency** - Same notification system app-wide

### Migration Example

**Before (Custom Component)**:
```tsx
const [show, setShow] = useState(false)
const [change, setChange] = useState(null)

<StateChangeNotification
  show={show}
  oldState={change.old}
  newState={change.new}
  onClose={() => setShow(false)}
/>
```

**After (react-toastify)**:
```tsx
toast.info(`Monster state changed!`)
```

## Troubleshooting

### Toast Not Appearing

**Problem**: Toasts don't show up

**Solution**: Verify `ToastContainer` is in your layout:
```tsx
// src/app/layout.tsx
<ToastContainer />
```

### Styles Not Applied

**Problem**: Toasts look unstyled

**Solution**: Import the CSS:
```tsx
import 'react-toastify/dist/ReactToastify.css'
```

### Multiple Toasts Stacking

**Problem**: Too many toasts appear at once

**Solution**: Limit toasts or use `toast.dismiss()`:
```tsx
// Dismiss all
toast.dismiss()

// Dismiss specific
const toastId = toast.info('Message')
toast.dismiss(toastId)
```

## Related Documentation

- [React-Toastify Official Docs](https://fkhadra.github.io/react-toastify/introduction)
- [Monster State Change System](../features/dynamic-monster-assets.md)
- [useMonsterPolling Hook](../api/use-monster-polling.md)
