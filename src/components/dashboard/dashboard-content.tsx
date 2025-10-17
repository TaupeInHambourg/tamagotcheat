'use client'
import { useState } from 'react'
import Button from '../Button'
import { authClient } from '@/lib/auth-client'
import CreateMonsterModal from '../modals/create-monster-modal'
import { CreateMonsterDto } from '@/types/monster.types'

type Session = typeof authClient.$Infer.Session

function DashboardContent ({ session }: { session: Session }): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const handleLogout = (): void => {
    void authClient.signOut()
    window.location.href = '/sign-in'
  }

  const handleCreateCreature = (): void => {
    setIsModalOpen(true)
  }

  const handleSubmitMonster = (monsterData: CreateMonsterDto): void => {
    void (async () => {
      try {
        const response = await fetch('/api/monsters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...monsterData,
            level: 1,
            state: 'happy',
            ownerId: session.user.id
          })
        })

        if (!response.ok) {
          throw new Error('Failed to create monster')
        }

        setIsModalOpen(false)
        // TODO: Ajouter une notification de succès ou rafraîchir la liste des monstres
      } catch (error) {
        console.error('Error creating monster:', error)
        // TODO: Ajouter une notification d'erreur
      }
    })()
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl font-bold mb-4'>Bienvenue {session.user.email} sur votre tableau de bord</h1>
      <Button onClick={handleCreateCreature}>
        Créer une créature
      </Button>
      <p className='text-lg text-gray-600'>Ici, vous pouvez gérer vos créatures et suivre votre progression.</p>
      <Button onClick={handleLogout}>
        Se déconnecter
      </Button>

      <CreateMonsterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitMonster}
      />
    </div>
  )
}

export default DashboardContent
