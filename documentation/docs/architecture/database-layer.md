---
sidebar_position: 3
---

# Database Layer

The database layer handles all data persistence through the **Repository Pattern**.

## Repository Pattern

Repositories abstract database operations behind interfaces, providing a clean separation between business logic and data access.

### Benefits

- ✅ **Testability**: Easy to mock for unit tests
- ✅ **Flexibility**: Can swap database implementations
- ✅ **Clean Code**: Business logic doesn't know about database details
- ✅ **Type Safety**: Full TypeScript support

## Architecture

```
┌──────────────────────────────────┐
│   Service Layer                  │
│   (Business Logic)               │
└──────────────┬───────────────────┘
               │ depends on
               ↓
┌──────────────────────────────────┐
│   IMonsterRepository             │
│   (Interface/Abstraction)        │
└──────────────┬───────────────────┘
               │ implemented by
               ↓
┌──────────────────────────────────┐
│   MongooseMonsterRepository      │
│   (Concrete Implementation)      │
└──────────────┬───────────────────┘
               │ uses
               ↓
┌──────────────────────────────────┐
│   Mongoose Models                │
│   (Database Schema)              │
└──────────────────────────────────┘
```

## Repository Interface

Located in `src/db/repositories/interfaces/monster.repository.interface.ts`:

```typescript
/**
 * Monster Repository Interface
 * 
 * Defines the contract for monster data access operations.
 * Follows the Dependency Inversion Principle (DIP).
 */
export interface IMonsterRepository {
  /**
   * Creates a new monster in the database
   */
  create(monsterData: CreateMonsterData): Promise<Monster>

  /**
   * Finds all monsters belonging to a specific owner
   */
  findByOwnerId(ownerId: string): Promise<Monster[]>

  /**
   * Finds a single monster by its ID and owner
   */
  findByIdAndOwner(id: string, ownerId: string): Promise<Monster | null>

  /**
   * Updates a monster's data
   */
  update(id: string, ownerId: string, updates: Partial<Monster>): Promise<Monster | null>

  /**
   * Deletes a monster
   */
  delete(id: string, ownerId: string): Promise<boolean>
}
```

## Mongoose Implementation

Located in `src/db/repositories/implementations/mongoose-monster.repository.ts`:

```typescript
export class MongooseMonsterRepository implements IMonsterRepository {
  /**
   * Ensures database connection before operations
   */
  private async ensureConnection(): Promise<void> {
    await connectMongooseToDatabase()
  }

  /**
   * Serializes Mongoose document to plain JavaScript object
   */
  private serialize<T>(doc: unknown): T {
    return JSON.parse(JSON.stringify(doc))
  }

  /**
   * Validates MongoDB ObjectId format
   */
  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id)
  }

  async create(monsterData: CreateMonsterData): Promise<Monster> {
    await this.ensureConnection()
    
    const monster = new MonsterModel({
      ownerId: monsterData.ownerId,
      name: monsterData.name,
      draw: monsterData.draw,
      state: monsterData.state,
      level: monsterData.level
    })

    const savedMonster = await monster.save()
    return this.serialize<Monster>(savedMonster)
  }

  async findByOwnerId(ownerId: string): Promise<Monster[]> {
    await this.ensureConnection()

    if (!this.isValidObjectId(ownerId)) {
      throw new Error(`Invalid owner ID format: ${ownerId}`)
    }

    const monsters = await MonsterModel.find({ ownerId }).exec()
    return this.serialize<Monster[]>(monsters)
  }

  // ... other methods
}
```

## Database Models

Located in `src/db/models/monster.model.ts`:

```typescript
/**
 * Monster Mongoose Model
 *
 * Defines the database schema for monsters.
 * This is the data layer representation.
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

const MONSTER_STATES = ['happy', 'angry', 'sleeping', 'hungry', 'sad'] as const

const monsterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  draw: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: MONSTER_STATES,
    default: 'happy'
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
})

export default mongoose.models.Monster ?? mongoose.model('Monster', monsterSchema)
```

## Factory Pattern

Located in `src/db/repositories/index.ts`:

```typescript
/**
 * Repository Factory
 *
 * Provides centralized creation of repository instances.
 * Makes it easy to switch implementations or mock for testing.
 */
import { MongooseMonsterRepository } from './implementations/mongoose-monster.repository'
import type { IMonsterRepository } from './interfaces/monster.repository.interface'

export function createMonsterRepository(): IMonsterRepository {
  return new MongooseMonsterRepository()
}
```

## Usage Example

### In Service Layer

```typescript
export class MonsterService implements IMonsterService {
  constructor(
    private readonly monsterRepository: IMonsterRepository // ← Interface
  ) {}

  async createMonster(userId: string, monsterData: CreateMonsterDto) {
    // Business logic here...
    
    // Call repository (implementation is abstracted)
    const monster = await this.monsterRepository.create({
      ownerId: userId,
      name: monsterData.name,
      draw: template.draw,
      state: 'happy',
      level: 1
    })

    return { success: true, data: monster }
  }
}
```

### In Tests

```typescript
describe('MonsterService', () => {
  it('should create a monster', async () => {
    // Mock repository
    const mockRepository: IMonsterRepository = {
      create: jest.fn().mockResolvedValue(mockMonster),
      findByOwnerId: jest.fn(),
      findByIdAndOwner: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }

    const service = new MonsterService(mockRepository)
    const result = await service.createMonster('user123', monsterData)

    expect(result.success).toBe(true)
    expect(mockRepository.create).toHaveBeenCalled()
  })
})
```

## Connection Management

Located in `src/db/index.ts`:

```typescript
/**
 * Database Connection Module
 *
 * Manages MongoDB connections using both native driver and Mongoose.
 */
import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:...`

// Native MongoDB client (for better-auth)
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Mongoose connection
async function connectMongooseToDatabase(): Promise<void> {
  try {
    await mongoose.connect(uri)
    console.log('Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
    throw error
  }
}

export { client, connectToDatabase, connectMongooseToDatabase }
```

## Best Practices

### ✅ DO

- Use interfaces for repository contracts
- Validate input (ObjectId format, required fields)
- Handle errors gracefully
- Serialize Mongoose documents to plain objects
- Ensure connection before operations
- Add comprehensive JSDoc comments

### ❌ DON'T

- Access Mongoose models directly from services
- Mix business logic with database operations
- Forget to handle connection errors
- Return Mongoose documents directly (serialization issues)
- Skip input validation

## Error Handling

```typescript
async findByIdAndOwner(id: string, ownerId: string): Promise<Monster | null> {
  await this.ensureConnection()

  // Validate inputs
  if (!this.isValidObjectId(id)) {
    throw new Error(`Invalid monster ID format: ${id}`)
  }

  if (!this.isValidObjectId(ownerId)) {
    throw new Error(`Invalid owner ID format: ${ownerId}`)
  }

  // Execute query
  const monster = await MonsterModel.findOne({ _id: id, ownerId }).exec()

  // Handle not found
  if (monster === null) {
    return null
  }

  return this.serialize<Monster>(monster)
}
```

## Next Steps

- [Service Layer](./service-layer) - How services use repositories
- [SOLID Principles](./solid-principles) - Design principles applied
- [Testing Guide](../guides/testing) - Test repositories
