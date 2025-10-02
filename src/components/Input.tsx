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
    <label>
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-flare-500'
      />
    </label>
  )
}

export default InputField
