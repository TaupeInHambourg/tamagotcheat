'use client'

import { CreateMonsterDto } from '@/types/monster.types'
import CreateMonsterForm from '../forms/create-monster-form'

interface CreateMonsterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (monsterData: CreateMonsterDto) => void
}

export default function CreateMonsterModal ({ isOpen, onClose, onSubmit }: CreateMonsterModalProps): React.ReactNode {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-2xl font-bold text-pink-flare-900 mb-4'>Créer un nouveau monstre</h2>
        <CreateMonsterForm
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
