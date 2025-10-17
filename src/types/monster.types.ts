export type MonsterState = 'happy' | 'angry' | 'sleeping' | 'hungry' | 'sad'

export interface Monster {
  name: string
  level: number
  draw: string
  state: MonsterState
  ownerId: string
}

export type CreateMonsterDto = Omit<Monster, 'level' | 'state' | 'ownerId'>
