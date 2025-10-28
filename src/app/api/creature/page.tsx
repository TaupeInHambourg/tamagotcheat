import { getMonsterById } from '@/actions/monsters.actions'
import ErrorClient from '@/components/error-client'
import { redirect } from 'next/dist/server/api-utils'

async function CreaturePage ({ params }: { params: { id: string } }) {
  const { id } = await params
  const monster = await getMonsterById(id)

  if (!monster || monster === null || monster === undefined) {
    return <ErrorClient error='Creature not found.' />
  }

  return (
    <div>Creature Page for ID: {id}</div>
  )
}

export default CreaturePage
