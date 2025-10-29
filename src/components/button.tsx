import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'outline'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Composant Button - Style Cosy Automnal
 *
 * Responsabilité unique : Afficher un bouton avec différentes variantes
 * Suit les principes SOLID avec des variantes extensibles
 */
function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-4 py-2 text-sm rounded-lg'
    case 'md': return 'px-6 py-3 text-base rounded-xl'
    case 'lg': return 'px-8 py-4 text-lg rounded-xl'
    case 'xl': return 'px-10 py-5 text-xl rounded-2xl'
  }
}

function getVariant (variant: 'primary' | 'secondary' | 'ghost' | 'link' | 'outline', disabled: boolean): string {
  if (disabled) {
    return 'bg-chestnut-light/30 text-chestnut-light cursor-not-allowed'
  }

  switch (variant) {
    case 'primary':
      return 'bg-gradient-to-r from-autumn-coral to-autumn-cinnamon text-white hover:from-autumn-terracotta hover:to-autumn-brown hover:shadow-lg shadow-md hover:scale-105 active:scale-95'
    case 'secondary':
      return 'bg-gradient-to-r from-moss-soft to-moss-medium text-white hover:from-moss-medium hover:to-moss-deep hover:shadow-lg shadow-md hover:scale-105 active:scale-95'
    case 'ghost':
      return 'bg-transparent text-autumn-cinnamon hover:bg-autumn-cream hover:text-autumn-brown active:scale-95'
    case 'link':
      return 'bg-transparent text-autumn-cinnamon underline hover:text-autumn-brown active:scale-95'
    case 'outline':
      return 'bg-white/90 text-chestnut-dark border-2 border-autumn-peach hover:bg-autumn-cream hover:border-autumn-coral shadow-md hover:scale-105 active:scale-95'
  }
}

function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps): React.ReactNode {
  return (
    <button
      className={`font-semibold transition-all duration-300 ${disabled ? '' : 'cursor-pointer'} ${getSize(size)} ${getVariant(variant, disabled)} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
