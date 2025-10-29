/**
 * Composant Input - Style Cosy Automnal
 *
 * Responsabilité unique : Afficher un champ de saisie avec label et gestion d'erreur
 * Suit les principes SOLID avec une interface claire
 */
function InputField ({
  type = 'text',
  name,
  label,
  value,
  error,
  onChange,
  onChangeText,
  placeholder,
  required = false
}: {
  type?: string
  name?: string
  label?: string
  value?: string
  error?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeText?: (text: string) => void
  placeholder?: string
  required?: boolean
}): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  return (
    <div className='space-y-2'>
      {label !== undefined && (
        <label htmlFor={name} className='block text-sm font-semibold text-chestnut-deep'>
          {label}
          {required && <span className='text-maple-warm ml-1'>*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={`input-cozy ${error !== undefined ? 'border-maple-warm focus:ring-maple-warm/20' : ''}`}
      />
      {error !== undefined && (
        <p className='mt-1 text-sm text-maple-warm flex items-center gap-1'>
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

export default InputField
