'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MonsterNavigationProps {
  previousId: string | null
  nextId: string | null
}

/**
 * MonsterNavigation - Navigation arrows for creatures carousel
 * 
 * Displays previous/next arrows on the sides to navigate between creatures.
 * Follows SOLID principles with single responsibility.
 * 
 * @param previousId - ID of the previous monster (null if none)
 * @param nextId - ID of the next monster (null if none)
 */
export function MonsterNavigation ({ previousId, nextId }: MonsterNavigationProps): React.ReactNode {
  const router = useRouter()

  const handleNavigation = (id: string): void => {
    router.push(`/creatures/${id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNavigation(id)
    }
  }

  if (previousId === null && nextId === null) {
    return null
  }

  return (
    <>
      {/* Previous Arrow - Left Side */}
      {previousId !== null && (
        <Link
          href={`/creatures/${previousId}`}
          className='fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-10
                     bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 md:p-4
                     transition-all duration-200 hover:scale-110 hover:shadow-xl
                     border-2 border-monsters-pink/20 hover:border-monsters-pink
                     group'
          aria-label='Créature précédente'
          onKeyDown={(e) => { handleKeyDown(e, previousId) }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-monsters-pink group-hover:text-monsters-pink-dark transition-colors'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
          </svg>
        </Link>
      )}

      {/* Next Arrow - Right Side */}
      {nextId !== null && (
        <Link
          href={`/creatures/${nextId}`}
          className='fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-10
                     bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 md:p-4
                     transition-all duration-200 hover:scale-110 hover:shadow-xl
                     border-2 border-monsters-pink/20 hover:border-monsters-pink
                     group'
          aria-label='Créature suivante'
          onKeyDown={(e) => { handleKeyDown(e, nextId) }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-monsters-pink group-hover:text-monsters-pink-dark transition-colors'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
          </svg>
        </Link>
      )}
    </>
  )
}
