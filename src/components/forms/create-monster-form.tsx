'use client'

import { useState } from 'react'
import { CreateMonsterDto } from '@/types/monster.types'
import { ValidationError, validateMonsterForm } from '@/utils/monster-form-validator'

import Button from '../Button'
import InputField from '../Input'

const MONSTER_COLORS = {
  green: '#48BB78', // Vert émeraude
  blue: '#4299E1', // Bleu océan
  pink: '#ED64A6', // Rose vif
  gold: '#D69E2E' // Doré
} as const

type MonsterColorKey = keyof typeof MONSTER_COLORS

interface CreateMonsterFormProps {
  onSubmit: (data: CreateMonsterDto) => void
  onCancel: () => void
}

interface FormData {
  name: string
  colorKey: MonsterColorKey
}

export default function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    colorKey: 'pink'
  })

  const [error, setError] = useState<string>('')

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setError('')

    try {
      validateMonsterForm({ name: formData.name })

      onSubmit({
        name: formData.name,
        color: MONSTER_COLORS[formData.colorKey]
      })
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message)
      } else {
        setError('Une erreur inattendue est survenue')
      }
    }
  }

  const handleColorChange = (colorKey: MonsterColorKey): void => {
    setFormData({ ...formData, colorKey })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {error !== '' && (
        <div className='bg-red-50 border-l-4 border-red-400 p-4 rounded'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className='space-y-4'>
        <div className='space-y-2'>
          <InputField
            label='Nom de ta créature'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Ex: Fluffy'
            required
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-pink-flare-800'>
            Quelle est ta couleur préférée ?
          </label>
          <div className='grid grid-cols-4 gap-3'>
            {(Object.entries(MONSTER_COLORS) as Array<[MonsterColorKey, string]>).map(([key, color]) => (
              <div key={key} className='relative'>
                <input
                  type='radio'
                  name='monster-color'
                  id={`color-${key}`}
                  value={key}
                  checked={formData.colorKey === key}
                  onChange={() => handleColorChange(key)}
                  className='sr-only peer'
                />
                <label
                  htmlFor={`color-${key}`}
                  style={{ backgroundColor: color }}
                  className={`
                    block w-full aspect-square rounded-lg cursor-pointer
                    transition-all duration-200 ease-in-out
                    hover:ring-2 hover:ring-offset-2 hover:ring-${key === 'gold' ? 'yellow' : key}-400
                    peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-${key === 'gold' ? 'yellow' : key}-400
                    peer-checked:brightness-100
                    brightness-75
                  `}
                  aria-label={`Couleur ${key}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-3'>
        <Button type='button' variant='ghost' onClick={onCancel}>
          Annuler
        </Button>
        <Button type='submit' variant='primary'>
          Créer
        </Button>
      </div>
    </form>
  )
}
