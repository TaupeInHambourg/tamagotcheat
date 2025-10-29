/**
 * Button Component Props
 *
 * Type definitions for the Button component following TypeScript best practices.
 */

import type { ReactNode, MouseEvent } from 'react'
import type { ButtonSize, ButtonVariant } from './button.styles'

/**
 * Button component properties
 *
 * Extends native button attributes while providing type-safe props
 * for styling and behavior customization.
 */
export interface ButtonProps {
  /**
   * Content to display inside the button
   */
  children: ReactNode

  /**
   * Click event handler
   * @param event - Mouse event object
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void

  /**
   * Visual size of the button
   * @default 'md'
   */
  size?: ButtonSize

  /**
   * Style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean

  /**
   * Additional CSS classes to apply
   * @default ''
   */
  className?: string

  /**
   * HTML button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'

  /**
   * Optional ARIA label for accessibility
   */
  ariaLabel?: string
}
