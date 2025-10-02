# TamagoTcheat AI Agent Instructions

## Project Overview
TamagoTcheat is a Next.js application built with TypeScript and TailwindCSS. The project uses the new Next.js App Router architecture and focuses on modern React patterns.

## Key Technologies
- Next.js 15.5.4 (App Router)
- React 19.1.0
- TypeScript
- TailwindCSS 4
- Turbopack for builds
- ts-standard for linting

## Project Structure
```
src/
  app/           # Next.js App Router pages and layouts
    page.tsx     # Main landing page
  components/    # Reusable React components
    button.tsx   # Common button component with variants
```

## Development Workflow
1. Install dependencies:
```bash
npm install
```

2. Start the development server with Turbopack:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Lint and fix TypeScript code:
```bash
npm run lint
```

## Component Patterns
### Button Component
The `Button` component (`src/components/button.tsx`) follows these conventions:
- Size variants: 'sm', 'md', 'lg', 'xl'
- Style variants: 'primary', 'secondary', 'ghost', 'link', 'outline'
- Uses TailwindCSS for styling with custom pink-flare color palette
- Implements disabled states and hover/active animations

Example usage:
```tsx
<Button 
  size="md"
  variant="primary"
  disabled={false}
  onClick={() => {}}
>
  Click me
</Button>
```

## CSS Conventions
- Uses TailwindCSS utility classes
- Custom grid layout system in app page: `grid-rows-[20px_1fr_20px]`
- Responsive design using Tailwind breakpoints (sm:)
- Custom color palette using pink-flare theme

## Best Practices
1. Maintain TypeScript type safety - all props should be properly typed
2. Follow ts-standard linting rules
3. Use semantic HTML and maintain accessibility standards
4. Implement responsive designs using Tailwind breakpoints
5. Keep components small and focused on a single responsibility

## Architecture & Design Principles

### SOLID Principles
1. **Single Responsibility (S)**
   - Each component should have one reason to change
   - Example: `Button` component handles only UI presentation and interactions

2. **Open/Closed (O)**
   - Components should be extensible without modification
   - Use composition and props for variations (see `Button` variants)
   - Prefer interfaces over concrete implementations

3. **Liskov Substitution (L)**
   - Child components must be substitutable for their parent types
   - Maintain consistent prop interfaces across related components

4. **Interface Segregation (I)**
   - Keep component interfaces small and focused
   - Split large prop interfaces into smaller, logical groups
   - Example: Separate style props from behavior props

5. **Dependency Inversion (D)**
   - Components should depend on abstractions, not concrete implementations
   - Use dependency injection through props
   - Avoid direct imports of concrete implementations when possible

### Clean Code Practices
1. **Meaningful Names**
   - Use descriptive variable and function names
   - Follow TypeScript naming conventions
   - Example: `getVariant()` clearly describes its purpose

2. **Function Rules**
   - Keep functions small and focused (max ~20 lines)
   - Functions should do one thing
   - Use meaningful parameter names
   - Limit the number of parameters (max 3, use objects for more)

3. **Comments & Documentation**
   - Code should be self-documenting
   - Only comment complex business logic or non-obvious decisions
   - Use TypeScript types for documentation

4. **Error Handling**
   - Use TypeScript's type system to prevent errors
   - Handle edge cases explicitly
   - Provide meaningful error messages

### Clean Architecture
1. **Layer Separation**
   - Maintain clear boundaries between:
     - UI Components (presentation)
     - Business Logic (use cases)
     - Data Access (repositories/services)

2. **Dependencies**
   - Dependencies should point inward
   - Core business logic should not depend on UI or external services
   - Use interfaces to define boundaries between layers

3. **Data Flow**
   - Follow unidirectional data flow
   - Props down, events up
   - Use React context sparingly and document usage

4. **Testing**
   - Write tests according to layer:
     - UI: Component tests
     - Business Logic: Unit tests
     - Integration: E2E tests
   - Mock external dependencies appropriately