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

function getSize (size: 'sm' | 'md' | 'lg' | 'xl'): string {
  switch (size) {
    case 'sm': return 'px-2 py-1 text-sm rounded-sm'
    case 'md': return 'px-4 py-2 text-md rounded-md'
    case 'lg': return 'px-6 py-3 text-lg rounded-lg'
    case 'xl': return 'px-8 py-4 text-xl rounded-xl'
  }
}

function getVariant (variant: 'primary' | 'secondary' | 'ghost' | 'link' | 'outline', disabled: boolean): string {
  switch (variant) {
    case 'primary': return disabled ? 'bg-transparent text-pink-flare-200' : 'bg-pink-flare-600 text-pink-flare-50 hover:bg-pink-flare-700'
    case 'secondary': return disabled ? 'bg-transparent text-pink-flare-200' : 'bg-pink-flare-200 text-pink-flare-900 hover:bg-pink-flare-300'
    case 'ghost': return disabled ? 'bg-transparent text-pink-flare-200' : 'bg-transparent text-pink-flare-600 hover:bg-pink-flare-100'
    case 'link': return disabled ? 'bg-transparent text-pink-flare-200' : 'bg-transparent text-pink-flare-600 underline hover:text-pink-flare-800'
    case 'outline': return disabled ? 'bg-transparent border-pink-flare-200 text-pink-flare-200' : 'bg-transparent border-2 border-pink-flare-600 text-pink-flare-600 hover:bg-pink-flare-100'
  }
}

function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false,
  type
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}): React.ReactNode {
  return (
    <button
      className={`rounded-md  ${disabled ? '' : 'transition-all duration-300 cursor-pointer active:scale-95'} ${getSize(size)} ${getVariant(variant, disabled)}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
