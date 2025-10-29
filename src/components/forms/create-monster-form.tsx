/**
 * Create Monster Form Component
 *
 * Form for creating a new monster with name and template selection.
 * Follows SOLID principles with separated concerns and proper validation.
 *
 * Features:
 * - Real-time form validation
 * - Visual template selection with color-coded options
 * - Error handling and user feedback
 * - Responsive design
 *
 * @component
 */

'use client'

import { useState } from 'react'
import { CreateMonsterDto, MonsterTemplates } from '@/types/monster.types'
import { ValidationError, validateMonsterForm } from '@/utils/monster-form-validator'

import Button from '../Button'
import InputField from '../Input'

/**
 * Monster color constants (legacy - not actively used but kept for compatibility)
 */
const MONSTER_COLORS = {
  green: 'var(--color-monsters-green)',
  blue: 'var(--color-monsters-blue)',
  pink: 'var(--color-monsters-pink)',
  purple: 'var(--color-monsters-purple)'
} as const

type MonsterColorKey = keyof typeof MONSTER_COLORS

/**
 * Props for the CreateMonsterForm component
 */
interface CreateMonsterFormProps {
  /** Callback invoked when form is successfully submitted */
  onSubmit: (data: CreateMonsterDto) => void
  /** Callback invoked when user cancels the form */
  onCancel: () => void
}

/**
 * Internal form state structure
 */
interface FormData {
  name: string
  colorKey: MonsterColorKey
  templateId: string
}

export default function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  // Form state management
  const [formData, setFormData] = useState<FormData>({
    name: '',
    colorKey: 'pink',
    templateId: 'chat-cosmique' // Default template
  })

  const [error, setError] = useState<string>('')

  /**
   * Handles form submission with validation
   * @param e - Form event
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    setError('')

    try {
      // Validate form data
      validateMonsterForm({ name: formData.name, templateId: formData.templateId })

      // Submit valid data
      onSubmit({
        name: formData.name,
        color: MONSTER_COLORS[formData.colorKey],
        templateId: formData.templateId
      })
    } catch (err) {
      // Handle validation errors
      if (err instanceof ValidationError) {
        setError(err.message)
      } else {
        setError('Une erreur inattendue est survenue')
      }
    }
  }

  /**
   * Updates the selected template
   * @param templateId - The template identifier to select
   */
  const handleTemplateChange = (templateId: string): void => {
    setFormData({ ...formData, templateId })
  }

  /**
   * Generates CSS classes for template selection boxes
   * Uses color-coded styling based on template type
   *
   * @param id - Template identifier
   * @param isSelected - Whether this template is currently selected
   * @returns CSS class string
   */
  const getTemplateClasses = (id: string, isSelected: boolean): string => {
    const baseClasses = 'block w-full max-w-32 aspect-square rounded-lg cursor-pointer transition-all duration-300 ease-in-out border-4 shadow-md hover:shadow-xl relative mx-auto'

    switch (id) {
      case 'chat-cosmique': // Soft Blue (#a2bffe)
        return `${baseClasses} ${
          isSelected
            ? 'border-[#7a9ffd] bg-[#a2bffe] shadow-[#a2bffe]/60 scale-110 ring-4 ring-[#d0ddff]'
            : 'border-[#d0ddff] bg-[#d0ddff] hover:border-[#a2bffe] hover:scale-105'
        }`
      case 'dino-nuage': // Soft Green (lighter)
        return `${baseClasses} ${
          isSelected
            ? 'border-[#9dd6a6] bg-[#bce5c3] shadow-[#bce5c3]/60 scale-110 ring-4 ring-[#e0f4e4]'
            : 'border-[#e0f4e4] bg-[#e0f4e4] hover:border-[#bce5c3] hover:scale-105'
        }`
      case 'fairy-monster': // Soft Pink (#ff1059)
        return `${baseClasses} ${
          isSelected
            ? 'border-[#d90d4a] bg-[#ff1059] shadow-[#ff1059]/60 scale-110 ring-4 ring-[#ff8aad]'
            : 'border-[#ff8aad] bg-[#ff8aad] hover:border-[#ff1059] hover:scale-105'
        }`
      case 'grenouille-etoilee': // Soft Purple (lighter)
        return `${baseClasses} ${
          isSelected
            ? 'border-[#bea8e0] bg-[#d5c4ed] shadow-[#d5c4ed]/60 scale-110 ring-4 ring-[#ebe3f5]'
            : 'border-[#ebe3f5] bg-[#ebe3f5] hover:border-[#d5c4ed] hover:scale-105'
        }`
      default:
        return baseClasses
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {error !== '' && (
        <div className='bg-maple-blush border-l-4 border-maple-warm p-4 rounded-xl shadow-sm'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-maple-warm' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-maple-deep font-medium'>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className='space-y-6'>
        <div className='space-y-3'>
          <label className='block text-base font-bold text-chestnut-deep'>
            🌟 Donne un nom à ta créature
          </label>
          <InputField
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='Ex: Fluffy, Piko, Mochi...'
            required
          />
          <p className='text-xs text-chestnut-medium italic'>
            Choisis un nom unique et mignon pour ton nouveau compagnon ! 💕
          </p>
        </div>

        <div className='space-y-4'>
          <label className='block text-base font-bold text-chestnut-deep'>
            🎨 Choisis ta couleur préférée
          </label>
          <div className='grid grid-cols-4 gap-4'>
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
                  {/* Visual-only colored box, no content */}
                  {formData.templateId === id && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <svg className='w-12 h-12 text-white drop-shadow-lg' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                      </svg>
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>
          <p className='text-xs text-chestnut-medium italic'>
            Chaque créature a sa propre personnalité unique ! 🌈
          </p>
        </div>
      </div>

      <div className='flex justify-end gap-4 pt-4 border-t-2 border-autumn-peach/30'>
        <Button type='button' variant='ghost' onClick={onCancel} size='lg'>
          Annuler
        </Button>
        <Button type='submit' variant='primary' size='lg'>
          ✨ Créer ma créature
        </Button>
      </div>
    </form>
  )
}
