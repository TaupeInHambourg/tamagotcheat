/**
 * StateChangeNotification Component
 *
 * Displays a toast notification when a monster's state changes.
 * Appears temporarily and fades out automatically.
 *
 * Usage:
 * ```tsx
 * <StateChangeNotification
 *   monsterName="Fluffy"
 *   oldState="happy"
 *   newState="hungry"
 *   show={true}
 *   onClose={() => setShow(false)}
 * />
 * ```
 */

'use client'

import { useEffect } from 'react'

interface StateChangeNotificationProps {
  monsterName: string
  oldState: string
  newState: string
  show: boolean
  onClose: () => void
  autoCloseDuration?: number // milliseconds
}

function getStateEmoji (state: string): string {
  const emojis: Record<string, string> = {
    happy: '😄',
    sad: '😢',
    angry: '😤',
    hungry: '😋',
    sleepy: '😴'
  }
  return emojis[state] ?? '😶'
}

function getStateColor (state: string): string {
  const colors: Record<string, string> = {
    happy: 'bg-green-500',
    sad: 'bg-gray-500',
    angry: 'bg-red-500',
    hungry: 'bg-yellow-500',
    sleepy: 'bg-blue-500'
  }
  return colors[state] ?? 'bg-gray-500'
}

export function StateChangeNotification ({
  monsterName,
  oldState,
  newState,
  show,
  onClose,
  autoCloseDuration = 5000
}: StateChangeNotificationProps): React.JSX.Element | null {
  useEffect(() => {
    if (show && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDuration)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [show, autoCloseDuration, onClose])

  if (!show) return null

  return (
    <div className='fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300'>
      <div className='bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm'>
        <div className='flex items-start gap-3'>
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getStateColor(newState)} flex items-center justify-center text-white text-xl`}>
            {getStateEmoji(newState)}
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-semibold text-gray-900'>
              Changement d'humeur !
            </p>
            <p className='text-sm text-gray-600 mt-1'>
              <span className='font-medium'>{monsterName}</span> est maintenant{' '}
              <span className='font-medium text-gray-900'>
                {newState === 'happy' && 'heureux'}
                {newState === 'sad' && 'triste'}
                {newState === 'angry' && 'en colère'}
                {newState === 'hungry' && 'affamé'}
                {newState === 'sleepy' && 'endormi'}
              </span>
            </p>
            <div className='flex items-center gap-2 mt-2 text-xs text-gray-500'>
              <span>{getStateEmoji(oldState)}</span>
              <span>→</span>
              <span>{getStateEmoji(newState)}</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className='flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='Fermer'
          >
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
