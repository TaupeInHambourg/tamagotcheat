/**
 * Monster Form Validator
 *
 * Provides validation logic for monster creation forms.
 * Follows Single Responsibility Principle - only handles validation.
 *
 * Validation Rules:
 * - Name: Required, 2-30 characters
 * - Template ID: Required, non-empty
 */

import { CreateMonsterDto } from '@/types/monster.types'

/**
 * Custom error class for form validation failures
 * Extends Error to provide field-specific validation context
 */
export class ValidationError extends Error {
  field: keyof CreateMonsterDto

  /**
   * Creates a new validation error
   * @param field - The form field that failed validation
   * @param message - Human-readable error message
   */
  constructor (field: keyof CreateMonsterDto, message: string) {
    super(message)
    this.field = field
    this.name = 'ValidationError'
  }
}

/**
 * Validation constraints for monster creation
 */
const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 30
} as const

/**
 * Validates monster creation form data
 *
 * @param formData - The form data to validate
 * @throws {ValidationError} If validation fails
 *
 * @example
 * ```ts
 * try {
 *   validateMonsterForm({ name: 'Fluffy', templateId: 'chat-cosmique' })
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.error(`Field ${error.field}: ${error.message}`)
 *   }
 * }
 * ```
 */
export function validateMonsterForm (formData: { name: string, templateId: string }): void {
  // Validate name is not empty
  if (formData.name.trim() === '') {
    throw new ValidationError('name', 'Le nom est requis')
  }

  // Validate name length
  if (formData.name.length < VALIDATION_RULES.NAME_MIN_LENGTH ||
      formData.name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    throw new ValidationError(
      'name',
      `Le nom doit contenir entre ${VALIDATION_RULES.NAME_MIN_LENGTH} et ${VALIDATION_RULES.NAME_MAX_LENGTH} caractères`
    )
  }

  // Validate template ID
  if (formData.templateId.trim() === '') {
    throw new ValidationError('templateId', 'Le type de monstre est requis')
  }
}
