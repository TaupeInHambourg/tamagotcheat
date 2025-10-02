function InputField ({
  type,
  name,
  label,
  value,
  onChange,
  onChangeText
}: {
  type?: string
  name?: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeText?: (text: string) => void
}): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText(e.target.value)
  }

  return (
    <div className='space-y-2'>
      <label htmlFor={name} className='block text-sm font-medium text-pink-flare-800'>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className='w-full px-4 py-2.5 rounded-lg border border-pink-flare-200
          focus:outline-none focus:ring-2 focus:ring-pink-flare-500 focus:border-transparent
          placeholder:text-pink-flare-300 bg-white/50 backdrop-blur-sm text-pink-flare-900'
      />
    </div>
  )
}

export default InputField
