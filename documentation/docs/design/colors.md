---
sidebar_position: 1
---

# Color System

TamagoTcheat's color palette and usage guidelines.

## Brand Colors

### Pink Flare Theme

The primary color scheme uses a pink-based palette:

```css
/* Primary Pink Flare Colors */
--pink-flare-50: #fdf2f8
--pink-flare-100: #fce7f3
--pink-flare-200: #fbcfe8
--pink-flare-300: #f9a8d4
--pink-flare-400: #f472b6
--pink-flare-500: #ec4899
--pink-flare-600: #db2777
--pink-flare-700: #be185d
--pink-flare-800: #9f1239
--pink-flare-900: #831843
```

## Color Usage

### Primary Actions

```tsx
// Primary buttons, main CTAs
<Button variant="primary" className="bg-pink-flare-500">
  Create Monster
</Button>
```

### Secondary Actions

```tsx
// Secondary buttons, less prominent actions
<Button variant="secondary" className="bg-pink-flare-200">
  Cancel
</Button>
```

### Backgrounds

```tsx
// Page backgrounds
<div className="bg-gradient-to-b from-pink-flare-50 to-white">
  {/* Content */}
</div>

// Card backgrounds
<div className="bg-white rounded-lg shadow">
  {/* Card content */}
</div>
```

## Semantic Colors

### Success

```css
--success-light: #d1fae5
--success: #10b981
--success-dark: #047857
```

Usage:
```tsx
<div className="bg-green-100 text-green-800 border-green-300">
  Monster created successfully!
</div>
```

### Error

```css
--error-light: #fee2e2
--error: #ef4444
--error-dark: #b91c1c
```

Usage:
```tsx
<div className="bg-red-100 text-red-800 border-red-300">
  Failed to save monster
</div>
```

### Warning

```css
--warning-light: #fef3c7
--warning: #f59e0b
--warning-dark: #d97706
```

Usage:
```tsx
<div className="bg-yellow-100 text-yellow-800 border-yellow-300">
  Monster is hungry!
</div>
```

### Info

```css
--info-light: #dbeafe
--info: #3b82f6
--info-dark: #1d4ed8
```

Usage:
```tsx
<div className="bg-blue-100 text-blue-800 border-blue-300">
  New quest available
</div>
```

## Text Colors

### Primary Text

```tsx
// Main content text
<p className="text-gray-900">Primary text content</p>
```

### Secondary Text

```tsx
// Supporting text, metadata
<p className="text-gray-600">Secondary information</p>
```

### Muted Text

```tsx
// Placeholder, disabled text
<p className="text-gray-400">Muted or disabled text</p>
```

## Monster State Colors

Each monster emotional state has an associated color:

```tsx
const stateColors = {
  happy: '#10b981',    // Green
  sad: '#3b82f6',      // Blue
  angry: '#ef4444',    // Red
  hungry: '#f59e0b',   // Orange
  sleepy: '#8b5cf6'    // Purple
}
```

Usage:
```tsx
<div 
  className="monster-indicator"
  style={{ backgroundColor: stateColors[monster.currentState] }}
/>
```

## Rarity Colors

Item rarity levels use distinct colors:

```tsx
const rarityColors = {
  common: '#9ca3af',     // Gray
  uncommon: '#10b981',   // Green
  rare: '#3b82f6',       // Blue
  epic: '#a855f7',       // Purple
  legendary: '#f59e0b'   // Gold
}
```

Usage:
```tsx
<div className="item-card" data-rarity={item.rarity}>
  <div 
    className="rarity-badge"
    style={{ backgroundColor: rarityColors[item.rarity] }}
  >
    {item.rarity}
  </div>
</div>
```

## Gradient Examples

### Hero Gradient

```tsx
<div className="bg-gradient-to-br from-pink-flare-400 via-pink-flare-500 to-pink-flare-600">
  {/* Hero content */}
</div>
```

### Card Gradient

```tsx
<div className="bg-gradient-to-b from-pink-flare-50 to-transparent">
  {/* Card content */}
</div>
```

### Hover Gradient

```tsx
<button className="hover:bg-gradient-to-r hover:from-pink-flare-500 hover:to-pink-flare-600">
  Hover me
</button>
```

## Accessibility

### Color Contrast

All color combinations meet WCAG AA standards:

- **Text on backgrounds**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio
- **UI components**: Minimum 3:1 ratio

### Examples

✅ Good contrast:
```tsx
<div className="bg-pink-flare-500 text-white">
  High contrast text
</div>
```

❌ Poor contrast:
```tsx
<div className="bg-pink-flare-100 text-white">
  Low contrast text (avoid)
</div>
```

### Color Blindness

Don't rely on color alone:

```tsx
// Good: Uses icon + color
<div className="flex items-center gap-2 text-green-600">
  <CheckIcon />
  <span>Success</span>
</div>

// Bad: Color only
<div className="text-green-600">
  Success
</div>
```

## Dark Mode (Future)

Prepared color variables for dark mode:

```css
@media (prefers-color-scheme: dark) {
  --background: #1f2937
  --foreground: #f9fafb
  --primary: #ec4899
  --secondary: #6b7280
}
```

## Usage Examples

### Button Colors

```tsx
// Primary action
<Button className="bg-pink-flare-500 hover:bg-pink-flare-600 text-white">
  Primary
</Button>

// Secondary action
<Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">
  Secondary
</Button>

// Danger action
<Button className="bg-red-500 hover:bg-red-600 text-white">
  Delete
</Button>
```

### State Indicators

```tsx
// Online status
<span className="inline-block w-2 h-2 bg-green-500 rounded-full" />

// Processing status
<span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />

// Error status
<span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
```

### Monster Card

```tsx
<div className="bg-white rounded-lg shadow-lg border-2 border-pink-flare-200">
  <div className="bg-gradient-to-b from-pink-flare-50 to-transparent p-4">
    <h3 className="text-gray-900 font-bold">{monster.name}</h3>
    <p className="text-gray-600">Level {monster.level}</p>
  </div>
  <div 
    className="h-2 rounded-b-lg"
    style={{ backgroundColor: stateColors[monster.currentState] }}
  />
</div>
```

## Best Practices

### Do's
✅ Use semantic color names  
✅ Maintain consistent color usage  
✅ Test color contrast  
✅ Consider accessibility  
✅ Use CSS variables for themes  

### Don'ts
❌ Don't hardcode color values  
❌ Don't rely on color alone for meaning  
❌ Don't use too many colors  
❌ Don't ignore contrast ratios  
❌ Don't mix color systems  

## Color Palette Reference

```typescript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'pink-flare': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9f1239',
          900: '#831843',
        }
      }
    }
  }
}
```
