/**
 * useToggle Hook
 *
 * Simple hook for boolean toggle state management.
 * Common pattern extracted to reduce code duplication.
 *
 * @module hooks/use-toggle
 */

import { useState, useCallback } from 'react'

/**
 * Hook to manage boolean toggle state
 *
 * @param initialValue - Initial boolean value (default: false)
 * @returns Tuple of [value, toggle, setTrue, setFalse, setValue]
 *
 * @example
 * ```tsx
 * const [isOpen, toggleOpen, openModal, closeModal] = useToggle()
 *
 * <button onClick={openModal}>Open</button>
 * <button onClick={closeModal}>Close</button>
 * <button onClick={toggleOpen}>Toggle</button>
 * ```
 */
export function useToggle (
  initialValue: boolean = false
): [boolean, () => void, () => void, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return [value, toggle, setTrue, setFalse, setValue]
}
