'use client'

import { useState } from 'react'
import { CreateMonsterDto } from '@/types/monster.types'
import { ValidationError, validateMonsterForm } from '@/utils/monster-form-validator'
import Button from '../Button'
import InputField from '../Input'

interface CreateMonsterFormProps {
  onSubmit: (data: CreateMonsterDto) => void
  onCancel: () => void
}

export default function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [formData, setFormData] = useState<CreateMonsterDto>({
    name: '',
    draw: ''
  })

  const [errors, setErrors] = useState<ValidationError[]>([])

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    const validationErrors = validateMonsterForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    onSubmit(formData)
  }

  const getFieldError = (field: keyof CreateMonsterDto): string | undefined => {
    return errors.find(error => error.field === field)?.message
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <InputField
        type='text'
        name='name'
        label='Nom du monstre'
        value={formData.name}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, name: text }))
          setErrors(errors.filter(error => error.field !== 'name'))
        }}
        error={getFieldError('name')}
      />

      <InputField
        type='text'
        name='draw'
        label='Dessin du monstre (URL)'
        value={formData.draw}
        onChangeText={(text) => {
          setFormData(prev => ({ ...prev, draw: text }))
          setErrors(errors.filter(error => error.field !== 'draw'))
        }}
        error={getFieldError('draw')}
      />

      <div className='flex justify-end space-x-3 pt-4'>
        <Button
          variant='outline'
          onClick={onCancel}
          type='button'
        >
          Annuler
        </Button>
        <Button
          variant='primary'
          type='submit'
        >
          Créer le monstre
        </Button>
      </div>
    </form>
  )
}
