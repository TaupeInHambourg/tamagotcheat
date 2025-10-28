import { CreateMonsterDto } from '@/types/monster.types'

export class ValidationError extends Error {
  field: keyof CreateMonsterDto

  constructor (field: keyof CreateMonsterDto, message: string) {
    super(message)
    this.field = field
    this.name = 'ValidationError'
  }
}

export function validateMonsterForm (formData: { name: string }): void {
  if (formData.name.trim() === '') {
    throw new ValidationError('name', 'Le nom est requis')
  }

  if (formData.name.length < 2 || formData.name.length > 30) {
    throw new ValidationError('name', 'Le nom doit contenir entre 2 et 30 caractères')
  }
}
