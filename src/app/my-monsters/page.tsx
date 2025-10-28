'use client'

import { useEffect, useState } from 'react'
import { Monster } from '@/types/monster.types'
import MonsterList from '@/components/monsters/monster-list'

export default function MyMonstersPage (): React.ReactNode {
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void fetchMonsters()
  }, [])

  const fetchMonsters = async (): Promise<void> => {
    try {
      const response = await fetch('/api/monsters')
      if (!response.ok) throw new Error('Impossible de récupérer les monstres')

      const data = await response.json()
      setMonsters(data)
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des monstres')
      console.error('Error fetching monsters:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p>Chargement de tes monstres...</p>
      </div>
    )
  }

  if (error !== null) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-red-500'>{error}</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-pink-flare-900 mb-8'>Mes Monstres</h1>
      <MonsterList monsters={monsters} />
    </div>
  )
}
