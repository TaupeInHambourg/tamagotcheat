/**
 * Create Monster Modal Component
 *
 * Modal dialog for creating a new monster.
 * Styled with autumn/cozy theme to match the application design.
 */

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
    <div
      className='fixed inset-0 bg-chestnut-dark/60 backdrop-blur-md flex items-center justify-center z-[9999] animate-in fade-in duration-200 p-4'
      onClick={onClose}
    >
      <div
        className='bg-gradient-to-br from-autumn-cream via-white to-autumn-peach/20 rounded-3xl p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-autumn-peach/30 max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h2 className='text-3xl font-bold text-chestnut-deep mb-2'>
              ✨ Créer une nouvelle créature
            </h2>
            <p className='text-sm text-chestnut-medium'>
              Donne vie à ton nouveau compagnon virtuel ! 🌟
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-chestnut-medium hover:text-chestnut-dark transition-colors duration-200 p-2 hover:bg-autumn-peach/30 rounded-full'
            aria-label='Fermer'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        <CreateMonsterForm
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
