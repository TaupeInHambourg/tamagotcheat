# Quest System

The quest system provides daily and weekly challenges that reward players with Koins and Gifts.

## Quest Types

### Daily Quests
Reset every day at midnight (UTC):
- ✨ Create a new monster
- 📈 Reach level 5 with any monster
- ⭐ Earn 100 XP total
- 🎨 Collect 1 accessory

### Weekly Quests
Reset every Monday at midnight (UTC):
- 🏆 Reach level 10 with any monster
- 💎 Collect 5 accessories
- 🎯 Complete 5 daily quests
- 🌟 Earn 500 XP total

## Quest Configuration

```typescript
// src/config/quests.config.ts
export const DAILY_QUESTS: Quest[] = [
  {
    id: 'daily_create_monster',
    title: 'New Friend',
    description: 'Create a new monster',
    requirement: 1,
    reward: { koins: 50, gifts: 0 },
    resetInterval: 'daily',
    icon: '✨'
  },
  // ... more quests
];

export const WEEKLY_QUESTS: Quest[] = [
  {
    id: 'weekly_reach_level_10',
    title: 'Level Master',
    description: 'Reach level 10 with any monster',
    requirement: 10,
    reward: { koins: 200, gifts: 5 },
    resetInterval: 'weekly',
    icon: '🏆'
  },
  // ... more quests
];
```

## Quest Structure

### Quest Interface
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  requirement: number;
  reward: {
    koins: number;
    gifts: number;
  };
  resetInterval: 'daily' | 'weekly';
  icon: string;
}
```

### User Quest Progress
```typescript
interface UserQuest {
  questId: string;
  progress: number;
  completed: boolean;
  lastResetDate: Date;
  completedAt?: Date;
}
```

## Progress Tracking

### Automatic Updates
Quest progress updates automatically when:
- A monster is created
- A monster gains XP
- A monster levels up
- An accessory is purchased
- A daily quest is completed

### Progress Calculation
```typescript
// Example: XP Quest
const currentProgress = userQuests.find(
  q => q.questId === 'daily_earn_xp'
)?.progress ?? 0;

const totalXP = monsters.reduce((sum, m) => sum + m.xp, 0);

if (totalXP >= quest.requirement && !completed) {
  await completeQuest(questId, userId);
}
```

## Quest Completion

### Server Action
```typescript
export async function completeQuest(
  questId: string,
  userId: string
): Promise<QuestCompletionResult> {
  // 1. Verify quest eligibility
  const quest = await getQuest(questId);
  const userQuest = await getUserQuest(userId, questId);
  
  // 2. Check if already completed
  if (userQuest.completed) {
    return { success: false, message: 'Quest already completed' };
  }
  
  // 3. Verify progress meets requirement
  if (userQuest.progress < quest.requirement) {
    return { success: false, message: 'Quest not completed yet' };
  }
  
  // 4. Award rewards
  await updateWallet(userId, {
    koins: quest.reward.koins,
    gifts: quest.reward.gifts
  });
  
  // 5. Mark as completed
  await markQuestComplete(userId, questId);
  
  return {
    success: true,
    rewards: quest.reward,
    message: `Quest completed! Earned ${quest.reward.koins}K and ${quest.reward.gifts}🎁`
  };
}
```

### Reward Distribution
```typescript
interface QuestReward {
  koins: number;
  gifts: number;
}

const REWARD_MULTIPLIERS = {
  daily: 1,
  weekly: 4
};

// Weekly quests give 4x more rewards
function calculateReward(
  baseReward: QuestReward,
  interval: 'daily' | 'weekly'
): QuestReward {
  const multiplier = REWARD_MULTIPLIERS[interval];
  return {
    koins: baseReward.koins * multiplier,
    gifts: baseReward.gifts * multiplier
  };
}
```

## Reset System

### Daily Reset
```typescript
// Runs at midnight UTC
async function resetDailyQuests() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setUTCHours(0, 0, 0, 0);
  
  // Reset all user daily quests
  await UserQuest.updateMany(
    {
      resetInterval: 'daily',
      lastResetDate: { $lt: midnight }
    },
    {
      $set: {
        progress: 0,
        completed: false,
        lastResetDate: now
      }
    }
  );
}
```

### Weekly Reset
```typescript
// Runs every Monday at midnight UTC
async function resetWeeklyQuests() {
  const now = new Date();
  const lastMonday = getLastMonday(now);
  
  // Reset all user weekly quests
  await UserQuest.updateMany(
    {
      resetInterval: 'weekly',
      lastResetDate: { $lt: lastMonday }
    },
    {
      $set: {
        progress: 0,
        completed: false,
        lastResetDate: now
      }
    }
  );
}
```

## UI Components

### QuestCard
```tsx
<QuestCard
  quest={quest}
  progress={userProgress}
  onClaim={handleClaimReward}
  canClaim={progress >= requirement && !completed}
/>
```

Features:
- Progress bar with percentage
- Reward display (Koins and Gifts)
- Claim button when eligible
- Completion status indicator
- Reset timer display

### QuestList
```tsx
<QuestList
  dailyQuests={dailyQuests}
  weeklyQuests={weeklyQuests}
  userProgress={userQuestProgress}
/>
```

Features:
- Tabs for daily/weekly quests
- Automatic refresh
- Completion animations
- Reward notifications

## Data Flow

```
User Action (create monster, earn XP, etc.)
    ↓
Quest Service checks relevant quests
    ↓
Update progress in database
    ↓
Check if quest is completed
    ↓
If completed: Award rewards
    ↓
Update UI with new progress
    ↓
Show toast notification
```

## Best Practices

### Performance
- Batch quest updates when possible
- Cache quest configurations
- Use optimistic UI updates
- Index database queries on userId and questId

### User Experience
- Show progress in real-time
- Celebrate completions with animations
- Display time until reset
- Highlight claimable quests

### Data Integrity
- Validate quest completion server-side
- Prevent duplicate reward claims
- Atomic wallet updates
- Transaction rollback on errors

## Database Schema

### Quest Model
```typescript
const QuestSchema = new Schema({
  questId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirement: { type: Number, required: true },
  reward: {
    koins: { type: Number, required: true },
    gifts: { type: Number, required: true }
  },
  resetInterval: {
    type: String,
    enum: ['daily', 'weekly'],
    required: true
  },
  icon: { type: String, required: true }
});
```

### UserQuest Model
```typescript
const UserQuestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  questId: { type: String, required: true },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastResetDate: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// Compound index for efficient queries
UserQuestSchema.index({ userId: 1, questId: 1 }, { unique: true });
```

## Future Enhancements

- [ ] Quest chains (complete A to unlock B)
- [ ] Special event quests
- [ ] Guild/clan quests
- [ ] Seasonal quest rotations
- [ ] Quest leaderboards
- [ ] Quest achievements
- [ ] Custom quest creation (admin)
- [ ] Quest difficulty tiers
