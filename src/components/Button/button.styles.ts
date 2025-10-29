/**
 * Button Style Configuration
 *
 * Centralizes button styling logic following the Open/Closed Principle.
 * New variants or sizes can be added without modifying existing code.
 */

/**
 * Button size variants
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Button style variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'outline'

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
  primary: 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white hover:from-autumn-terracotta hover:to-autumn-brown hover:shadow-lg shadow-md hover:scale-105 active:scale-95',
  secondary: 'bg-gradient-to-r from-moss-soft to-moss-medium text-white hover:from-moss-medium hover:to-moss-deep hover:shadow-lg shadow-md hover:scale-105 active:scale-95',
  ghost: 'bg-transparent text-autumn-cinnamon hover:bg-autumn-cream hover:text-autumn-brown active:scale-95',
  link: 'bg-transparent text-autumn-cinnamon underline hover:text-autumn-brown active:scale-95',
  outline: 'bg-white/90 text-chestnut-dark border-2 border-autumn-peach hover:bg-autumn-cream hover:border-autumn-coral shadow-md hover:scale-105 active:scale-95'
}

/**
 * Disabled state styling
 */
const DISABLED_STYLE = 'bg-chestnut-light/30 text-chestnut-light cursor-not-allowed'

/**
 * Gets the CSS classes for a given button size
 * @param size - The button size variant
 * @returns Tailwind CSS classes for the size
 */
export function getSizeClasses (size: ButtonSize): string {
  return SIZE_STYLES[size]
}

/**
 * Gets the CSS classes for a given button variant
 * Takes into account whether the button is disabled
 *
 * @param variant - The button style variant
 * @param isDisabled - Whether the button is disabled
 * @returns Tailwind CSS classes for the variant
 */
export function getVariantClasses (variant: ButtonVariant, isDisabled: boolean): string {
  if (isDisabled) {
    return DISABLED_STYLE
  }

  return VARIANT_STYLES[variant]
}

/**
 * Combines all button classes into a single string
 * @param size - The button size variant
 * @param variant - The button style variant
 * @param isDisabled - Whether the button is disabled
 * @param additionalClasses - Optional additional CSS classes
 * @returns Combined CSS class string
 */
export function getButtonClasses (
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
