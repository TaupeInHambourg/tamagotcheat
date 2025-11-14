---
sidebar_position: 5
---

# Service Layer

The service layer implements business logic and coordinates between the data layer and presentation layer.

## Overview

Services in TamagoTcheat follow clean architecture principles:
- **Single Responsibility**: Each service handles one domain
- **Dependency Inversion**: Services depend on interfaces, not implementations
- **Business Logic**: All domain rules live in services
- **Testability**: Services are easily testable through mocking

## Architecture

```
┌─────────────────┐
│   Actions       │ (Server Actions - Next.js)
└────────┬────────┘
         │
┌────────▼────────┐
│   Services      │ (Business Logic)
└────────┬────────┘
         │
┌────────▼────────┐
│  Repositories   │ (Data Access)
└────────┬────────┘
         │
┌────────▼────────┐
│   Database      │ (MongoDB)
└─────────────────┘
```

## Service Structure

### Base Service Interface

```typescript
// src/services/interfaces/base.service.ts
export interface BaseService<T> {
  create(data: Partial<T>): Promise<T>
  findById(id: string): Promise<T | null>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<boolean>
}
```

### Example Service Implementation

```typescript
// src/services/implementations/monster.service.ts
export class MonsterService implements BaseService<IMonster> {
  constructor(
    private readonly repository: MonsterRepository,
    private readonly xpSystem: XPSystem
  ) {}

  async create(data: CreateMonsterData): Promise<IMonster> {
    // Validate data
    this.validateMonsterData(data)

    // Apply business rules
    const monsterData = {
      ...data,
      level: 1,
      xp: 0,
      happiness: 100,
      hunger: 0,
      currentState: 'happy',
      lastInteraction: new Date()
    }

    // Delegate to repository
    return await this.repository.create(monsterData)
  }

  async gainXP(monsterId: string, amount: number): Promise<IMonster> {
    const monster = await this.repository.findById(monsterId)
    if (!monster) throw new Error('Monster not found')

    // Business logic: Calculate new XP and level
    const newXP = monster.xp + amount
    const newLevel = this.xpSystem.calculateLevel(newXP)
    const leveledUp = newLevel > monster.level

    // Update monster
    const updated = await this.repository.update(monsterId, {
      xp: newXP,
      level: newLevel
    })

    // Handle side effects
    if (leveledUp) {
      await this.handleLevelUp(updated)
    }

    return updated
  }

  private validateMonsterData(data: CreateMonsterData): void {
    if (!data.name || data.name.length < 3) {
      throw new Error('Name must be at least 3 characters')
    }
    if (!data.templateId) {
      throw new Error('Template ID is required')
    }
  }

  private async handleLevelUp(monster: IMonster): Promise<void> {
    // Business logic for level up rewards
    console.log(`${monster.name} leveled up to ${monster.level}!`)
  }
}
```

## Service Responsibilities

### 1. Data Validation

Services validate input before processing:

```typescript
class MonsterService {
  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Name is required')
    }
    if (name.length < 3 || name.length > 20) {
      throw new ValidationError('Name must be 3-20 characters')
    }
  }
}
```

### 2. Business Rules

All domain logic lives in services:

```typescript
class QuestService {
  async completeQuest(
    userId: string,
    questId: string
  ): Promise<QuestResult> {
    const quest = await this.repository.findById(questId)
    
    // Business rule: Check if already completed today
    if (this.isCompletedToday(quest, userId)) {
      throw new Error('Quest already completed today')
    }

    // Business rule: Validate quest requirements
    if (!this.meetsRequirements(quest, userId)) {
      throw new Error('Requirements not met')
    }

    // Award rewards
    const rewards = this.calculateRewards(quest)
    await this.awardRewards(userId, rewards)

    return { success: true, rewards }
  }
}
```

### 3. Coordination

Services coordinate between multiple repositories:

```typescript
class ShopService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly walletRepository: WalletRepository,
    private readonly inventoryRepository: InventoryRepository
  ) {}

  async purchaseItem(
    userId: string,
    itemId: string
  ): Promise<PurchaseResult> {
    // Get item details
    const item = await this.itemRepository.findById(itemId)
    
    // Check wallet balance
    const wallet = await this.walletRepository.findByUserId(userId)
    if (wallet.koins < item.price) {
      throw new Error('Insufficient funds')
    }

    // Deduct payment
    await this.walletRepository.update(userId, {
      koins: wallet.koins - item.price
    })

    // Add to inventory
    await this.inventoryRepository.addItem(userId, itemId)

    return { success: true, item }
  }
}
```

### 4. Side Effects

Services handle side effects and events:

```typescript
class MonsterService {
  async feedMonster(monsterId: string): Promise<IMonster> {
    const monster = await this.repository.findById(monsterId)
    
    // Update state
    const updated = await this.repository.update(monsterId, {
      hunger: Math.max(0, monster.hunger - 30),
      happiness: Math.min(100, monster.happiness + 10),
      currentState: this.calculateState(monster)
    })

    // Side effect: Award XP
    await this.gainXP(monsterId, 5)

    // Side effect: Check quest progress
    await this.questService.checkFeedingQuests(monster.userId)

    return updated
  }
}
```

## Dependency Injection

Services use constructor injection for dependencies:

```typescript
// Service definition
class MonsterService {
  constructor(
    private readonly repository: MonsterRepository,
    private readonly xpSystem: XPSystem,
    private readonly eventBus: EventBus
  ) {}
}

// Service initialization
const monsterRepository = new MonsterRepository()
const xpSystem = new XPSystem()
const eventBus = new EventBus()

const monsterService = new MonsterService(
  monsterRepository,
  xpSystem,
  eventBus
)
```

## Testing Services

Services are easily testable through mocking:

```typescript
describe('MonsterService', () => {
  let service: MonsterService
  let mockRepository: jest.Mocked<MonsterRepository>

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      create: jest.fn()
    } as any

    service = new MonsterService(mockRepository, new XPSystem())
  })

  it('should gain XP and level up', async () => {
    mockRepository.findById.mockResolvedValue({
      id: '1',
      xp: 90,
      level: 1
    } as IMonster)

    mockRepository.update.mockResolvedValue({
      id: '1',
      xp: 105,
      level: 2
    } as IMonster)

    const result = await service.gainXP('1', 15)

    expect(result.level).toBe(2)
    expect(mockRepository.update).toHaveBeenCalledWith('1', {
      xp: 105,
      level: 2
    })
  })
})
```

## Best Practices

### Do's
✅ Keep services focused on one domain  
✅ Validate all inputs  
✅ Handle errors gracefully  
✅ Use dependency injection  
✅ Document complex business logic  
✅ Write comprehensive tests  

### Don'ts
❌ Access database directly from services (use repositories)  
❌ Mix UI concerns with business logic  
❌ Create circular dependencies  
❌ Expose internal implementation details  
❌ Skip error handling  

## Service Registry

Current services in TamagoTcheat:

| Service | Domain | Responsibilities |
|---------|--------|------------------|
| `MonsterService` | Monsters | CRUD, state management, XP |
| `QuestService` | Quests | Quest completion, rewards |
| `ShopService` | Shop | Purchases, inventory |
| `WalletService` | Wallet | Balance management |
| `AccessoryService` | Accessories | Equipment management |
| `BackgroundService` | Backgrounds | Background management |

## Related Documentation

- [Database Layer](./database-layer) - How services use repositories
- [SOLID Principles](./solid-principles) - Design principles applied
- [Testing Guide](../guides/testing) - How to test services
