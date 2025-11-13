# Architecture Overview

TamagoTcheat follows Clean Architecture principles with a clear separation of concerns and adherence to SOLID principles.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Next.js App Router, React Components) │
├─────────────────────────────────────────┤
│         Application Layer               │
│    (Server Actions, Use Cases)          │
├─────────────────────────────────────────┤
│          Domain Layer                   │
│  (Business Logic, Entities, Services)   │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│  (Database, External APIs, Repositories)│
└─────────────────────────────────────────┘
```

## Clean Architecture Principles

### 1. Presentation Layer
**Location**: `src/app/`, `src/components/`

**Responsibilities**:
- Render UI components
- Handle user interactions
- Display data
- Routing and navigation

**Key Components**:
```
src/app/
├── page.tsx              # Landing page
├── dashboard/            # Dashboard routes
├── creatures/            # Monster management
├── shop/                 # Shop interface
├── quests/               # Quest list
└── gallery/              # Public gallery

src/components/
├── common/               # Shared UI components
├── monsters/             # Monster-specific UI
├── shop/                 # Shop UI components
├── quests/               # Quest UI components
└── skeletons/            # Loading states
```

**Design Patterns**:
- **Server Components**: Default for better performance
- **Client Components**: Only when needed (interactivity)
- **Composition**: Small, focused components
- **Render Props**: Generic ShopCard pattern

### 2. Application Layer
**Location**: `src/actions/`

**Responsibilities**:
- Orchestrate use cases
- Handle user requests
- Coordinate between layers
- Validate input data

**Server Actions**:
```typescript
// src/actions/monsters.actions.ts
export async function createMonster(
  name: string,
  templateName: string,
  userId: string
): Promise<ActionResult<Monster>> {
  // 1. Validate input
  // 2. Call domain service
  // 3. Handle errors
  // 4. Return result
}
```

**Key Files**:
- `monsters.actions.ts` - Monster operations
- `accessories.actions.ts` - Accessory management
- `backgrounds.actions.ts` - Background management
- `quests.actions.ts` - Quest operations
- `wallet.actions.ts` - Currency management
- `stripe.actions.ts` - Payment processing

### 3. Domain Layer
**Location**: `src/services/`, `src/types/`

**Responsibilities**:
- Business logic
- Domain rules
- Entity operations
- Use case implementation

**Service Pattern**:
```typescript
// Interface (abstraction)
interface IMonsterService {
  createMonster(data: CreateMonsterDto): Promise<Monster>;
  updateMonsterState(id: string): Promise<Monster>;
  addXP(id: string, amount: number): Promise<Monster>;
}

// Implementation
class MonsterService implements IMonsterService {
  constructor(
    private monsterRepository: IMonsterRepository
  ) {}
  
  async createMonster(data: CreateMonsterDto): Promise<Monster> {
    // Business logic here
    const monster = new Monster(data);
    return this.monsterRepository.save(monster);
  }
}
```

**Key Services**:
- `MonsterService` - Monster business logic
- `QuestService` - Quest management
- `WalletService` - Currency operations
- `AccessoryService` - Accessory logic

### 4. Infrastructure Layer
**Location**: `src/db/`

**Responsibilities**:
- Database access
- External API calls
- File system operations
- Third-party integrations

**Repository Pattern**:
```typescript
// Interface (domain layer)
interface IMonsterRepository {
  findById(id: string): Promise<Monster | null>;
  save(monster: Monster): Promise<Monster>;
  update(id: string, data: Partial<Monster>): Promise<Monster>;
  delete(id: string): Promise<void>;
}

// Implementation (infrastructure layer)
class MongooseMonsterRepository implements IMonsterRepository {
  async findById(id: string): Promise<Monster | null> {
    const doc = await MonsterModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }
  // ... other methods
}
```

**Database Structure**:
```
src/db/
├── index.ts                  # MongoDB connection
├── models/                   # Mongoose schemas
│   ├── monster.model.ts
│   ├── accessory.model.ts
│   ├── background.model.ts
│   ├── quest.model.ts
│   └── wallet.model.ts
└── repositories/
    ├── interfaces/           # Repository contracts
    └── implementations/      # Mongoose implementations
```

## SOLID Principles

### Single Responsibility Principle (S)
Each component/service has one reason to change:

✅ **Good Example**:
```typescript
// ShopCard: Only handles shop item display
export function ShopCard({ item, onPurchase, renderPreview }) {
  // UI logic only
}

// PurchaseService: Only handles purchases
class PurchaseService {
  async purchase(itemId: string, userId: string) {
    // Purchase logic only
  }
}
```

❌ **Bad Example**:
```typescript
// Too many responsibilities
function ShopCard({ item }) {
  // UI rendering
  // Database access
  // Business logic
  // API calls
}
```

### Open/Closed Principle (O)
Open for extension, closed for modification:

✅ **Good Example**:
```typescript
// Generic ShopCard - extend through props
<ShopCard
  item={accessory}
  renderPreview={() => <AccessoryPreview />}
  onPurchase={handlePurchase}
/>

<ShopCard
  item={background}
  renderPreview={() => <BackgroundPreview />}
  onPurchase={handlePurchase}
/>
```

### Liskov Substitution Principle (L)
Subtypes must be substitutable for base types:

```typescript
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}

// All repositories follow the same contract
class MonsterRepository implements IRepository<Monster> { }
class AccessoryRepository implements IRepository<Accessory> { }
class QuestRepository implements IRepository<Quest> { }
```

### Interface Segregation Principle (I)
Clients shouldn't depend on unused interfaces:

✅ **Good Example**:
```typescript
// Small, focused interfaces
interface IReadable<T> {
  findById(id: string): Promise<T | null>;
}

interface IWritable<T> {
  save(entity: T): Promise<T>;
}

// Components use only what they need
const MonsterDisplay: React.FC<{ repo: IReadable<Monster> }> = ({ repo }) => {
  // Only reading, doesn't need write methods
};
```

### Dependency Inversion Principle (D)
Depend on abstractions, not concretions:

✅ **Good Example**:
```typescript
// Service depends on interface
class MonsterService {
  constructor(
    private repository: IMonsterRepository  // Interface
  ) {}
}

// Can inject any implementation
const service = new MonsterService(
  new MongooseMonsterRepository()  // Or MockRepository for tests
);
```

## Design Patterns

### Repository Pattern
Abstracts data access:
```typescript
interface IMonsterRepository {
  findById(id: string): Promise<Monster | null>;
  findAll(): Promise<Monster[]>;
  save(monster: Monster): Promise<Monster>;
  update(id: string, data: Partial<Monster>): Promise<Monster>;
  delete(id: string): Promise<void>;
}
```

### Service Pattern
Encapsulates business logic:
```typescript
class QuestService {
  constructor(
    private questRepository: IQuestRepository,
    private walletService: IWalletService
  ) {}
  
  async completeQuest(questId: string, userId: string) {
    // Business logic
    const quest = await this.questRepository.findById(questId);
    await this.walletService.addRewards(userId, quest.rewards);
    await this.questRepository.markCompleted(questId, userId);
  }
}
```

### Render Props Pattern
Flexible component composition:
```typescript
interface ShopCardProps<T> {
  item: T;
  renderPreview: () => ReactNode;
  onPurchase: (item: T) => void;
}

export function ShopCard<T>({ item, renderPreview, onPurchase }: ShopCardProps<T>) {
  return (
    <div>
      {renderPreview()}
      <button onClick={() => onPurchase(item)}>Buy</button>
    </div>
  );
}
```

### Factory Pattern
Create objects without specifying exact class:
```typescript
class MonsterFactory {
  createMonster(template: MonsterTemplate, name: string): Monster {
    return {
      name,
      template: template.name,
      state: 'happy',
      level: 1,
      xp: 0,
      imageUrl: template.imageUrl
    };
  }
}
```

## Data Flow

### Read Flow (Query)
```
User Interface
    ↓
Server Component
    ↓
Server Action (optional)
    ↓
Service
    ↓
Repository
    ↓
Database
    ↓
← Entity (mapped)
    ↓
← DTO/Props
    ↓
← Render UI
```

### Write Flow (Command)
```
User Action
    ↓
Client Component (event)
    ↓
Server Action
    ↓
Validation
    ↓
Service (business logic)
    ↓
Repository
    ↓
Database
    ↓
← Success/Error
    ↓
← Update UI (optimistic)
    ↓
← Toast notification
```

## Error Handling

### Layered Approach
```typescript
// Infrastructure Layer
class MongooseRepository {
  async findById(id: string) {
    try {
      return await Model.findById(id);
    } catch (error) {
      throw new RepositoryError('Database error', error);
    }
  }
}

// Domain Layer
class MonsterService {
  async getMonster(id: string) {
    try {
      const monster = await this.repository.findById(id);
      if (!monster) throw new NotFoundError('Monster not found');
      return monster;
    } catch (error) {
      throw new ServiceError('Failed to get monster', error);
    }
  }
}

// Application Layer
export async function getMonsterAction(id: string) {
  try {
    return await monsterService.getMonster(id);
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Presentation Layer
async function handleGetMonster() {
  const result = await getMonsterAction(id);
  if (!result.success) {
    toast.error(result.error);
  }
}
```

## Testing Strategy

### Unit Tests
- Services (business logic)
- Utilities and helpers
- Mock repositories

### Integration Tests
- Repository implementations
- Server actions
- API routes

### Component Tests
- UI components
- User interactions
- Rendering logic

### E2E Tests
- Critical user flows
- Purchase process
- Quest completion

## Performance Optimization

### Server-Side
- React Server Components by default
- Streaming with Suspense
- Parallel data fetching
- Database query optimization

### Client-Side
- Code splitting
- Lazy loading
- Image optimization (Next.js Image)
- Optimistic UI updates

### Caching
- Server component caching
- Database query results
- Static assets (CDN)
- API responses

## Security

### Authentication
- Better Auth session management
- Protected routes
- Server-side validation

### Authorization
- User ownership checks
- Role-based access (future)
- API endpoint protection

### Data Validation
- Input sanitization
- Type checking (TypeScript)
- Server-side validation
- Database constraints

## Future Architecture Improvements

- [ ] Event-driven architecture for quest updates
- [ ] CQRS pattern for complex operations
- [ ] Real-time updates with WebSockets
- [ ] Microservices for heavy operations
- [ ] GraphQL API layer
- [ ] Redis caching layer
- [ ] Message queue for async tasks
