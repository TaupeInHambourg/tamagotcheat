---
sidebar_position: 2
---

# SOLID Principles

Tamagotcheat strictly follows SOLID principles for clean, maintainable code.

## S - Single Responsibility Principle

> Each class/module should have one, and only one, reason to change.

### ✅ Good Example

```typescript
// monster.service.ts - Only handles business logic
export class MonsterService {
  async createMonster(userId: string, data: CreateMonsterDto) {
    // Business logic only
  }
}

// mongoose-monster.repository.ts - Only handles database
export class MongooseMonsterRepository {
  async create(data: CreateMonsterData): Promise<Monster> {
    // Database operations only
  }
}
```

### ❌ Bad Example

```typescript
// DON'T: Mixing concerns
export class MonsterService {
  async createMonster(userId: string, data: CreateMonsterDto) {
    // ❌ Direct database access in service
    const monster = new MonsterModel(data)
    await monster.save()
    
    // ❌ UI concerns in service
    revalidatePath('/dashboard')
  }
}
```

## O - Open/Closed Principle

> Software entities should be open for extension, closed for modification.

### ✅ Good Example

```typescript
// Button component with variants
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-autumn-coral...',
  secondary: 'bg-gradient-to-r from-moss-soft...',
  ghost: 'bg-transparent...'
}

// Add new variant without modifying existing code
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  // ... existing variants
  danger: 'bg-red-500...' // ✅ Extension
}
```

### ❌ Bad Example

```typescript
// DON'T: Modifying existing code for new features
function getButtonStyle(variant: string) {
  if (variant === 'primary') return '...'
  if (variant === 'secondary') return '...'
  // ❌ Must modify function for new variant
  if (variant === 'danger') return '...'
}
```

## L - Liskov Substitution Principle

> Objects of a superclass should be replaceable with objects of its subclasses.

### ✅ Good Example

```typescript
interface IMonsterRepository {
  create(data: CreateMonsterData): Promise<Monster>
  findByOwnerId(ownerId: string): Promise<Monster[]>
}

// Can be replaced with any implementation
class MongooseMonsterRepository implements IMonsterRepository {
  async create(data: CreateMonsterData): Promise<Monster> { /* ... */ }
  async findByOwnerId(ownerId: string): Promise<Monster[]> { /* ... */ }
}

class InMemoryMonsterRepository implements IMonsterRepository {
  async create(data: CreateMonsterData): Promise<Monster> { /* ... */ }
  async findByOwnerId(ownerId: string): Promise<Monster[]> { /* ... */ }
}

// Both work interchangeably
const repository: IMonsterRepository = new MongooseMonsterRepository()
// or
const repository: IMonsterRepository = new InMemoryMonsterRepository()
```

## I - Interface Segregation Principle

> Clients should not be forced to depend on interfaces they don't use.

### ✅ Good Example

```typescript
// Small, focused interfaces
export interface IMonsterRepository {
  create(data: CreateMonsterData): Promise<Monster>
  findByOwnerId(ownerId: string): Promise<Monster[]>
  findByIdAndOwner(id: string, ownerId: string): Promise<Monster | null>
  update(id: string, ownerId: string, updates: Partial<Monster>): Promise<Monster | null>
  delete(id: string, ownerId: string): Promise<boolean>
}

// Different interface for read-only operations
export interface IMonsterReadRepository {
  findByOwnerId(ownerId: string): Promise<Monster[]>
  findByIdAndOwner(id: string, ownerId: string): Promise<Monster | null>
}
```

### ❌ Bad Example

```typescript
// DON'T: Fat interface with unrelated methods
interface IMonsterService {
  createMonster(...): Promise<Monster>
  getUserMonsters(...): Promise<Monster[]>
  sendEmail(...): Promise<void>          // ❌ Unrelated
  processPayment(...): Promise<void>     // ❌ Unrelated
  generateReport(...): Promise<string>   // ❌ Unrelated
}
```

## D - Dependency Inversion Principle

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

### ✅ Good Example

```typescript
// High-level service depends on interface (abstraction)
export class MonsterService implements IMonsterService {
  constructor(
    private readonly monsterRepository: IMonsterRepository // ← Interface
  ) {}
  
  async createMonster(userId: string, data: CreateMonsterDto) {
    // Uses interface, not concrete implementation
    return await this.monsterRepository.create(...)
  }
}

// Factory provides concrete implementation
export function createMonsterService(): IMonsterService {
  const repository = createMonsterRepository() // Concrete
  return new MonsterService(repository)       // Inject
}
```

### ❌ Bad Example

```typescript
// DON'T: Direct dependency on concrete class
export class MonsterService {
  private repository = new MongooseMonsterRepository() // ❌ Concrete
  
  async createMonster(userId: string, data: CreateMonsterDto) {
    return await this.repository.create(...)
  }
}
```

## Benefits in Our Project

### 🧪 Testability

```typescript
// Easy to mock repositories for testing
const mockRepository: IMonsterRepository = {
  create: jest.fn().mockResolvedValue(mockMonster),
  findByOwnerId: jest.fn().mockResolvedValue([])
}

const service = new MonsterService(mockRepository)
// Test service without database
```

### 🔄 Flexibility

```typescript
// Easy to swap implementations
const prodService = createMonsterService() // Uses Mongoose
const testService = new MonsterService(new InMemoryRepository()) // Uses memory
```

### 📦 Modularity

```typescript
// Each part can be developed/tested independently
// ✅ Repository team works on data access
// ✅ Service team works on business logic
// ✅ UI team works on components
```

## Real-World Examples

### Button Component (O, I)

```typescript
// Open/Closed: New sizes/variants without modification
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'outline'

// Interface Segregation: Focused props
export interface ButtonProps {
  children: ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  size?: ButtonSize
  variant?: ButtonVariant
  disabled?: boolean
}
```

### Monster Service (S, D)

```typescript
// Single Responsibility: Only business logic
// Dependency Inversion: Depends on IMonsterRepository
export class MonsterService implements IMonsterService {
  constructor(
    private readonly monsterRepository: IMonsterRepository
  ) {}
}
```

## Next Steps

- [Clean Architecture](./overview) - See how SOLID fits into Clean Architecture
- [Service Layer](./service-layer) - SOLID in action
- [Testing Guide](../guides/testing) - Test SOLID code
