export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const

export type MonsterState = typeof MONSTER_STATES[number]

export const DEFAULT_MONSTER_LEVEL = 1
export const DEFAULT_MONSTER_STATE: MonsterState = MONSTER_STATES[0]

// Pixel Monster Types (from GitHub v0-Tamagocheat)
export interface Monster {
  _id?: string
  name: string
  level: number
  color: string
  state: MonsterState
  draw: string
  ownerId?: string
  updatedAt?: string
  createdAt?: string
}

export interface CreateMonsterDto {
  name: string
  color: string
}
