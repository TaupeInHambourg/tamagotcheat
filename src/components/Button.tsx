/**
 * Button Component
 *
 * A reusable button component with multiple style variants and sizes.
 * Follows the autumn/cozy design theme of the application.
 *
 * Design Principles:
 * - Single Responsibility: Only handles button rendering and user interaction
 * - Open/Closed: Extended through variants and sizes without modifying core code
 * - Dependency Inversion: Depends on styling abstractions, not implementations
 *
 * Usage Example:
 * ```tsx
 * <Button
 *   variant="primary"
 *   size="md"
 *   onClick={handleClick}
 * >
 *   Click Me
 * </Button>
 * ```
 */

import type { ReactNode, MouseEvent } from 'react'

/**
 * Button size variants
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Button style variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'outline'

/**
 * Button component properties
 */
export interface ButtonProps {
  /**
   * Content to display inside the button
   */
  children: ReactNode

  /**
   * Click event handler
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

/**
 * Size-to-CSS mapping
 * Maps each size variant to its corresponding Tailwind classes
 */
const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-10 py-5 text-xl rounded-2xl'
}

/**
 * Variant-to-CSS mapping for enabled state
 * Maps each variant to its corresponding Tailwind classes
 */
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-autumn-peach to-autumn-coral text-chestnut-deep shadow-md hover:shadow-xl hover:shadow-monsters-pink-20 shadow-md hover:scale-105 active:scale-95',
  secondary: 'bg-gradient-to-r from-moss-soft to-moss-medium text-white hover:from-moss-medium hover:to-moss-deep hover:shadow-lg shadow-md hover:scale-105 active:scale-95',
  ghost: 'bg-transparent text-pink-flare-600 hover:bg-pink-flare-200 active:scale-95',
  link: 'bg-transparent text-autumn-cinnamon underline hover:text-autumn-brown active:scale-95',
  outline: 'bg-white/90 text-chestnut-dark border-2 border-autumn-peach hover:bg-autumn-cream hover:border-autumn-coral shadow-md hover:scale-105 active:scale-95'
}

/**
 * Disabled state styling
 */
const DISABLED_STYLE = 'bg-chestnut-light/30 text-chestnut-light cursor-not-allowed'

/**
 * Gets the CSS classes for a given button size
 */
function getSizeClasses (size: ButtonSize): string {
  return SIZE_STYLES[size]
}

/**
 * Gets the CSS classes for a given button variant
 * Takes into account whether the button is disabled
 */
function getVariantClasses (variant: ButtonVariant, isDisabled: boolean): string {
  if (isDisabled) {
    return DISABLED_STYLE
  }

  return VARIANT_STYLES[variant]
}

/**
 * Combines all button classes into a single string
 */
function getButtonClasses (
  size: ButtonSize,
  variant: ButtonVariant,
  isDisabled: boolean,
  additionalClasses: string = ''
): string {
  const baseClasses = 'font-semibold transition-all duration-300'
  const cursorClass = isDisabled ? '' : 'cursor-pointer'
  const sizeClasses = getSizeClasses(size)
  const variantClasses = getVariantClasses(variant, isDisabled)

  return `${baseClasses} ${cursorClass} ${sizeClasses} ${variantClasses} ${additionalClasses}`.trim()
}

/**
 * Button component with configurable variants and sizes
 *
 * Features:
 * - Multiple size options (sm, md, lg, xl)
 * - Multiple style variants (primary, secondary, ghost, link, outline)
 * - Disabled state handling
 * - Accessibility support
 * - Smooth transitions and animations
 */
function Button ({
  children,
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  ariaLabel
}: ButtonProps): ReactNode {
  const buttonClasses = getButtonClasses(size, variant, disabled, className)

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
