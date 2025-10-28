'use client'

import { useState } from 'react'
import { CreateMonsterDto, MonsterTemplates, MonsterTemplate } from '@/types/monster.types'
import { ValidationError, validateMonsterForm } from '@/utils/monster-form-validator'

import Button from '../Button'
import InputField from '../Input'

const MONSTER_COLORS = {
  green: 'var(--color-monsters-green)',
  blue: 'var(--color-monsters-blue)',
  pink: 'var(--color-monsters-pink)',
  purple: 'var(--color-monsters-purple)'
} as const

type MonsterColorKey = keyof typeof MONSTER_COLORS

interface CreateMonsterFormProps {
  onSubmit: (data: CreateMonsterDto) => void
  onCancel: () => void
}

interface FormData {
  name: string
  colorKey: MonsterColorKey
  templateId: string
}

export default function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    colorKey: 'pink',
    templateId: 'chat-cosmique' // Template par défaut
  })

  const [error, setError] = useState<string>('')

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setError('')

    try {
      validateMonsterForm({ name: formData.name, templateId: formData.templateId })

      onSubmit({
        name: formData.name,
        color: MONSTER_COLORS[formData.colorKey],
        templateId: formData.templateId
      })
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message)
      } else {
        setError('Une erreur inattendue est survenue')
      }
    }
  }

  const handleTemplateChange = (templateId: string): void => {
    setFormData({ ...formData, templateId })
  }

  const getTemplateClasses = (id: string, isSelected: boolean): string => {
    const baseClasses = 'block w-full p-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out border-2'

    switch (id) {
      case 'fairy-monster':
        return `${baseClasses} ${
          isSelected
            ? 'border-2 border-pink-500 bg-[var(--color-monsters-pink)] bg-opacity-50'
            : 'hover:border-pink-300 bg-[var(--color-monsters-pink)] bg-opacity-20'
        }`
      case 'chat-cosmique':
        return `${baseClasses} ${
          isSelected
            ? 'border-2 border-blue-500 bg-[var(--color-monsters-blue)] bg-opacity-50'
            : 'hover:border-blue-300 bg-[var(--color-monsters-blue)] bg-opacity-20'
        }`
      case 'grenouille-etoilee':
        return `${baseClasses} ${
          isSelected
            ? 'border-2 border-purple-500 bg-[var(--color-monsters-purple)] bg-opacity-50'
            : 'hover:border-purple-300 bg-[var(--color-monsters-purple)] bg-opacity-20'
        }`
      case 'dino-nuage':
        return `${baseClasses} ${
          isSelected
            ? 'border-2 border-green-500 bg-[var(--color-monsters-green)] bg-opacity-50'
            : 'hover:border-green-300 bg-[var(--color-monsters-green)] bg-opacity-20'
        }`
      default:
        return baseClasses
    }
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
            Choisi ta couleur préférée :
          </label>
          <div className='grid grid-cols-2 gap-3'>
            {Object.entries(MonsterTemplates).map(([id, template]) => (
              <div key={id} className='relative'>
                <input
                  type='radio'
                  name='monster-template'
                  id={`template-${id}`}
                  value={id}
                  checked={formData.templateId === id}
                  onChange={() => handleTemplateChange(id)}
                  className='sr-only peer'
                />
                <label
                  htmlFor={`template-${id}`}
                  className={getTemplateClasses(id, formData.templateId === id)}
                >
                  <div className='flex items-center gap-3' />
                </label>
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
