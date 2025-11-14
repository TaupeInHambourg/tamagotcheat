---
sidebar_position: 5
---

# Testing Guide

Guidelines for testing TamagoTcheat components and features.

## Testing Philosophy

TamagoTcheat follows a pragmatic testing approach:
- Test critical business logic
- Test complex component interactions
- Test data layer operations
- Avoid testing implementation details

## Testing Stack

(To be implemented)

The project is prepared to use:
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing
- **MSW** - API mocking
- **Playwright** - E2E testing

## Unit Testing

### Testing Services

```typescript
// Example: Testing monster service
import { MonsterService } from '@/services/implementations/monster.service'
import { MonsterRepository } from '@/db/repositories/monster.repository'

describe('MonsterService', () => {
  let service: MonsterService
  let mockRepository: jest.Mocked<MonsterRepository>

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      // ... other methods
    } as any

    service = new MonsterService(mockRepository)
  })

  it('should create a monster with default values', async () => {
    const monsterData = {
      name: 'Test Monster',
      templateId: 'chat-cosmique',
      userId: 'user123'
    }

    await service.create(monsterData)
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Monster',
        level: 1,
        xp: 0
      })
    )
  })
})
```

### Testing Utilities

```typescript
// Example: Testing XP system
import { calculateLevel, getXpForNextLevel } from '@/utils/xp-system'

describe('XP System', () => {
  it('should calculate correct level from XP', () => {
    expect(calculateLevel(0)).toBe(1)
    expect(calculateLevel(100)).toBe(2)
    expect(calculateLevel(350)).toBe(3)
  })

  it('should return correct XP needed for next level', () => {
    expect(getXpForNextLevel(1)).toBe(100)
    expect(getXpForNextLevel(2)).toBe(250)
  })
})
```

## Component Testing

### Testing React Components

```typescript
// Example: Testing Button component
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

## Integration Testing

### Testing Server Actions

```typescript
// Example: Testing monster actions
import { createMonster } from '@/actions/monsters.actions'
import { auth } from '@/lib/auth'

jest.mock('@/lib/auth')

describe('Monster Actions', () => {
  beforeEach(() => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: 'user123' }
    })
  })

  it('should create monster for authenticated user', async () => {
    const result = await createMonster({
      name: 'Test Monster',
      templateId: 'chat-cosmique',
      color: '#bce5c3'
    })

    expect(result.success).toBe(true)
    expect(result.data?.name).toBe('Test Monster')
  })

  it('should return error for unauthenticated user', async () => {
    (auth as jest.Mock).mockResolvedValue(null)

    const result = await createMonster({
      name: 'Test Monster',
      templateId: 'chat-cosmique'
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('authenticated')
  })
})
```

## E2E Testing

### Testing User Flows

```typescript
// Example: Playwright test
import { test, expect } from '@playwright/test'

test.describe('Monster Creation', () => {
  test('should create a new monster', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Click create monster button
    await page.click('text=Create Monster')
    
    // Fill form
    await page.fill('[name="name"]', 'My Pet')
    await page.selectOption('[name="template"]', 'chat-cosmique')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Verify redirect and success
    await expect(page).toHaveURL(/\/creatures\//)
    await expect(page.locator('text=My Pet')).toBeVisible()
  })
})
```

## Best Practices

### Do's
✅ Test behavior, not implementation  
✅ Write descriptive test names  
✅ Use meaningful assertions  
✅ Mock external dependencies  
✅ Keep tests isolated and independent  

### Don'ts
❌ Test implementation details  
❌ Write tests that depend on each other  
❌ Make tests too complex  
❌ Test third-party libraries  
❌ Ignore failing tests  

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- monster.service.test.ts
```

## Coverage Goals

Aim for:
- **Services**: 80%+ coverage
- **Utilities**: 90%+ coverage
- **Components**: 70%+ coverage
- **Actions**: 75%+ coverage

## Future Improvements

- [ ] Add Jest configuration
- [ ] Set up React Testing Library
- [ ] Configure Playwright
- [ ] Add CI/CD test pipeline
- [ ] Implement visual regression testing
