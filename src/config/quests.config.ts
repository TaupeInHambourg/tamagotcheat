/**
 * Quests Configuration
 *
 * Defines the available daily and weekly quests.
 * Each quest includes type, requirements, and rewards.
 *
 * Architecture:
 * - Single Responsibility: Quest catalog definition only
 * - Open/Closed: New quests can be added without modifying existing ones
 * - Interface Segregation: Clean quest interface
 *
 * Test intervals:
 * - Daily quests: Refresh every 30 seconds (production: 24 hours)
 * - Weekly quests: Refresh every 60 seconds (production: 7 days)
 *
 * @module config
 */

export type QuestType = 'feed' | 'play' | 'gift' | 'hug' | 'login_streak' | 'create_monster' | 'equip_accessory'

export type QuestPeriod = 'daily' | 'weekly'

export type RewardType = 'koins' | 'gifts'

export interface QuestDefinition {
  /** Unique identifier for the quest type */
  type: QuestType
  /** Display name of the quest */
  title: string
  /** Detailed description explaining what to do */
  description: string
  /** Emoji icon for visual representation */
  icon: string
  /** Number of times the action must be performed */
  targetCount: number
  /** Type of reward (koins or gifts) */
  rewardType: RewardType
  /** Amount of reward given */
  rewardAmount: number
  /** Human-readable reward description */
  rewardDescription: string
  /** Quest refresh period */
  period: QuestPeriod
}

/**
 * Daily quests - refresh every 30 seconds for testing (24h in production)
 *
 * These are simpler quests that encourage daily engagement
 */
export const DAILY_QUESTS: QuestDefinition[] = [
  {
    type: 'feed',
    title: 'Nourrir tes créatures',
    description: 'Nourris tes créatures 3 fois aujourd\'hui',
    icon: '🍖',
    targetCount: 3,
    rewardType: 'koins',
    rewardAmount: 10,
    rewardDescription: '10 Koins',
    period: 'daily'
  },
  {
    type: 'play',
    title: 'Jouer avec tes créatures',
    description: 'Joue avec tes créatures 5 fois aujourd\'hui',
    icon: '🎮',
    targetCount: 5,
    rewardType: 'gifts',
    rewardAmount: 1,
    rewardDescription: '1 Cadeau',
    period: 'daily'
  },
  {
    type: 'gift',
    title: 'Offrir des cadeaux',
    description: 'Offre 2 cadeaux à tes créatures',
    icon: '🎁',
    targetCount: 2,
    rewardType: 'koins',
    rewardAmount: 15,
    rewardDescription: '15 Koins',
    period: 'daily'
  },
  {
    type: 'hug',
    title: 'Câlins réconfortants',
    description: 'Fais 4 câlins à tes créatures',
    icon: '🤗',
    targetCount: 4,
    rewardType: 'gifts',
    rewardAmount: 1,
    rewardDescription: '1 Cadeau',
    period: 'daily'
  }
]

/**
 * Weekly quests - refresh every 60 seconds for testing (7 days in production)
 *
 * These are more challenging quests with better rewards
 */
export const WEEKLY_QUESTS: QuestDefinition[] = [
  {
    type: 'feed',
    title: 'Maître Nourricier',
    description: 'Nourris tes créatures 20 fois cette semaine',
    icon: '🍕',
    targetCount: 20,
    rewardType: 'koins',
    rewardAmount: 50,
    rewardDescription: '50 Koins',
    period: 'weekly'
  },
  {
    type: 'play',
    title: 'Champion du Jeu',
    description: 'Joue avec tes créatures 30 fois cette semaine',
    icon: '🏆',
    targetCount: 30,
    rewardType: 'gifts',
    rewardAmount: 5,
    rewardDescription: '5 Cadeaux',
    period: 'weekly'
  },
  {
    type: 'gift',
    title: 'Généreux Bienfaiteur',
    description: 'Offre 10 cadeaux à tes créatures cette semaine',
    icon: '🎄',
    targetCount: 10,
    rewardType: 'koins',
    rewardAmount: 75,
    rewardDescription: '75 Koins',
    period: 'weekly'
  },
  {
    type: 'equip_accessory',
    title: 'Fashionista',
    description: 'Équipe 5 accessoires cette semaine',
    icon: '👒',
    targetCount: 5,
    rewardType: 'gifts',
    rewardAmount: 3,
    rewardDescription: '3 Cadeaux',
    period: 'weekly'
  }
]

/**
 * All quest definitions combined
 */
export const ALL_QUESTS: QuestDefinition[] = [
  ...DAILY_QUESTS,
  ...WEEKLY_QUESTS
]

/**
 * Get a quest definition by type and period
 *
 * @param type - Quest type identifier
 * @param period - Quest period (daily or weekly)
 * @returns Quest definition or undefined if not found
 */
export function getQuestDefinition (
  type: QuestType,
  period: QuestPeriod
): QuestDefinition | undefined {
  return ALL_QUESTS.find(q => q.type === type && q.period === period)
}

/**
 * Get all quests for a specific period
 *
 * @param period - Quest period (daily or weekly)
 * @returns Array of quest definitions
 */
export function getQuestsByPeriod (period: QuestPeriod): QuestDefinition[] {
  return ALL_QUESTS.filter(q => q.period === period)
}

/**
 * Quest refresh intervals
 * For testing: daily=1h, weekly=2h
 * For production: daily=24h, weekly=7d
 */
export const QUEST_REFRESH_INTERVALS = {
  daily: 60 * 60 * 1000, // 1 hour for testing (24 * 60 * 60 * 1000 for production)
  weekly: 2 * 60 * 60 * 1000 // 2 hours for testing (7 * 24 * 60 * 60 * 1000 for production)
} as const

/**
 * Number of daily quests to show in dashboard preview
 */
export const DASHBOARD_QUEST_PREVIEW_COUNT = 3
