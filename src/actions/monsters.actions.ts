'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { CreateMonsterDto } from '@/types/monster.types'
import Monster from '@/db/models/monster.model'
import { connectMongooseToDatabase } from '@/db'
import { Types } from 'mongoose'
import { revalidatePath } from 'next/cache'

export async function createMonster (monsterData: CreateMonsterDto): Promise<void> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session === null || session === undefined) throw new Error('User not authenticated')

  const monster = new Monster({
    ownerId: session.user.id,
    name: monsterData.name,
    draw: monsterData.draw,
    state: 'happy',
    level: 1
  })

  await monster.save()
  revalidatePath('/dashboard')
}

export async function getMonsters (): Promise<Monster[]> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) throw new Error('User not authenticated')

    const { user } = session

    const monsters = await Monster.find({ ownerId: user.id }).exec()
    return JSON.parse(JSON.stringify(monsters))
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

export async function getMonsterById (id: string): Promise<Monster | null> {
  try {
    await connectMongooseToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) throw new Error('User not authenticated')

    const { user } = session

    const _id = id[0]

    if (!Types.ObjectId.isValid(user.id)) {
      console.error('Invalid user ID format:', user.id)
      return null
    }

    const monster = await Monster.findOne({ ownerId: user.id, _id: id }).exec()
    return JSON.parse(JSON.stringify(monster))
  } catch (error) {
    console.error('Error fetching monster by ID:', error)
    return null
  }
}
