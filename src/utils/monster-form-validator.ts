import { CreateMonsterDto } from '@/types/monster.types'

export interface ValidationError {
  field: keyof CreateMonsterDto
  message: string
}

export function validateMonsterForm (data: Partial<CreateMonsterDto>): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Le nom est requis'
    })
  } else if (data.name.length < 2 || data.name.length > 30) {
    errors.push({
      field: 'name',
      message: 'Le nom doit contenir entre 2 et 30 caractères'
    })
  }

  if (!data.draw?.trim()) {
    errors.push({
      field: 'draw',
      message: 'Le dessin est requis'
    })
  } else if (!isValidUrl(data.draw)) {
    errors.push({
      field: 'draw',
      message: 'L\'URL du dessin n\'est pas valide'
    })
  }

  return errors
}

function isValidUrl (url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
