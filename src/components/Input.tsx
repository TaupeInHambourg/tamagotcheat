/**
 * Input Field Component
 *
 * Reusable form input component with label and error handling.
 * Styled with autumn/cozy theme to match application design.
 *
 * Features:
 * - Optional label with required indicator
 * - Error state display
 * - Flexible event handling (onChange or onChangeText)
 * - Consistent styling across the application
 *
 * Follows SOLID principles:
 * - Single Responsibility: Only handles input rendering
 * - Open/Closed: Extended through props, not modification
 *
 * @component
 */

/**
 * Props for the InputField component
 */
interface InputFieldProps {
  /** HTML input type (text, email, password, etc.) */
  type?: string
  /** Input name attribute */
  name?: string
  /** Label text to display above input */
  label?: string
  /** Current value of the input */
  value?: string
  /** Error message to display */
  error?: string
  /** Standard onChange handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Alternative onChange handler that passes just the value string */
  onChangeText?: (text: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Whether the field is required */
  required?: boolean
}

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
}: InputFieldProps): React.ReactNode {
  /**
   * Handles input changes and calls appropriate callback
   * Supports both standard onChange and simplified onChangeText patterns
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  return (
    <div className='space-y-2'>
      {/* Label with optional required indicator */}
      {label !== undefined && (
        <label htmlFor={name} className='block text-sm font-semibold text-chestnut-deep'>
          {label}
          {required && <span className='text-maple-warm ml-1'>*</span>}
        </label>
      )}

      {/* Input field with conditional error styling */}
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

      {/* Error message display */}
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
