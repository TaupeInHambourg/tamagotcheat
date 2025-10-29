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
 *
 * @see {@link ButtonProps} for prop documentation
 */

import type { ReactNode } from 'react'
import { getButtonClasses } from './button.styles'
import type { ButtonProps } from './button.types'

/**
 * Button component with configurable variants and sizes
 *
 * Features:
 * - Multiple size options (sm, md, lg, xl)
 * - Multiple style variants (primary, secondary, ghost, link, outline)
 * - Disabled state handling
 * - Accessibility support
 * - Smooth transitions and animations
 *
 * @param props - Button configuration props
 * @returns Rendered button element
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
