---
sidebar_position: 1
---

# Architecture Overview

Tamagotcheat follows **Clean Architecture** principles to ensure maintainability, testability, and scalability.

## Clean Architecture Layers

```
┌────────────────────────────────────────────────┐
│         Presentation Layer (UI)                │
│  - Next.js Pages & Components                  │
│  - Server Actions (monsters.actions.ts)        │
└────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────┐
│         Business Logic Layer                   │
│  - Services (monster.service.ts)               │
│  - Validation & Business Rules                 │
└────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────┐
│         Data Access Layer                      │
│  - Repositories (monster.repository.ts)        │
│  - Database Operations                         │
└────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────┐
│         Database Layer                         │
│  - MongoDB + Mongoose                          │
│  - Data Models                                 │
└────────────────────────────────────────────────┘
```

## Key Principles

### 1. Dependency Rule

Dependencies point **inward**. Outer layers depend on inner layers, never the reverse.

- **UI** depends on **Services**
- **Services** depend on **Repositories**
- **Repositories** depend on **Database Models**

### 2. Separation of Concerns

Each layer has a distinct responsibility:

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Presentation** | Handle HTTP requests, render UI | `monsters.actions.ts` |
| **Business Logic** | Enforce rules, validate data | `monster.service.ts` |
| **Data Access** | CRUD operations, queries | `mongoose-monster.repository.ts` |
| **Database** | Data persistence | MongoDB schemas |

### 3. Interface Segregation

We use interfaces to define contracts between layers:

```typescript
// Repository Interface
export interface IMonsterRepository {
  create(data: CreateMonsterData): Promise<Monster>
  findByOwnerId(ownerId: string): Promise<Monster[]>
  // ...
}

// Service Interface
export interface IMonsterService {
  createMonster(userId: string, data: CreateMonsterDto): Promise<OperationResult<Monster>>
  getUserMonsters(userId: string): Promise<OperationResult<Monster[]>>
  // ...
}
```

## Folder Structure

```
src/
├── actions/              # Server Actions (Presentation)
│   └── monsters.actions.ts
├── services/             # Business Logic
│   ├── interfaces/
│   │   └── monster.service.interface.ts
│   ├── implementations/
│   │   └── monster.service.ts
│   └── index.ts
├── db/                   # Data Access
│   ├── repositories/
│   │   ├── interfaces/
│   │   │   └── monster.repository.interface.ts
│   │   ├── implementations/
│   │   │   └── mongoose-monster.repository.ts
│   │   └── index.ts
│   ├── models/
│   │   └── monster.model.ts
│   └── index.ts
├── types/                # Domain Models & DTOs
│   └── monster.types.ts
└── components/           # UI Components
    └── ...
```

## Data Flow

### Creating a Monster

```
User Action (UI)
       ↓
Server Action (monsters.actions.ts)
  - Authenticate user
  - Call service
       ↓
Service (monster.service.ts)
  - Validate input
  - Apply business rules
  - Call repository
       ↓
Repository (mongoose-monster.repository.ts)
  - Execute database operation
  - Return result
       ↓
Service
  - Format response
  - Return OperationResult<Monster>
       ↓
Server Action
  - Revalidate cache
  - Return to UI
```

## Benefits

### ✅ Testability
Each layer can be tested independently with mocks.

### ✅ Maintainability
Changes in one layer don't affect others.

### ✅ Scalability
Easy to add new features or change implementations.

### ✅ Flexibility
Can swap database or framework without touching business logic.

## Real Example

See how we create a monster:

```typescript
// 1. Action (Presentation)
export async function createMonster(data: CreateMonsterDto): Promise<void> {
  const user = await getAuthenticatedUser()
  const service = createMonsterService()
  const result = await service.createMonster(user.id, data)
  
  if (!result.success) throw new Error(result.error)
  revalidatePath('/dashboard')
}

// 2. Service (Business Logic)
async createMonster(userId: string, data: CreateMonsterDto) {
  // Validate
  if (!this.validateMonsterName(data.name)) {
    return { success: false, error: 'Invalid name' }
  }
  
  // Business logic
  const template = this.getTemplate(data.templateId)
  
  // Call repository
  const monster = await this.repository.create({
    ownerId: userId,
    name: data.name,
    draw: template.draw,
    state: 'happy',
    level: 1
  })
  
  return { success: true, data: monster }
}

// 3. Repository (Data Access)
async create(data: CreateMonsterData): Promise<Monster> {
  await this.ensureConnection()
  const monster = new Monster(data)
  return await monster.save()
}
```

## Next Steps

- [Database Layer](./database-layer) - Deep dive into repositories
- [Service Layer](./service-layer) - Business logic patterns
- [SOLID Principles](./solid-principles) - Applied examples
