/**
 * Carousel - Generic reusable carousel component
 *
 * Displays items in a swipeable carousel format for better mobile experience.
 * - Mobile: 1 item per view
 * - Tablet: configurable items per view
 * - Touch swipe navigation
 * - Auto-scroll optional
 * - Navigation arrows
 * - Dots indicator
 *
 * Design Principles:
 * - Single Responsibility: Only handles carousel display and navigation
 * - Open/Closed: Extensible through children and configuration
 * - Dependency Inversion: Accepts any React children
 *
 * @component
 */

'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

interface CarouselProps {
  /** Items to display in the carousel */
  children: ReactNode[]
  /** Number of items visible on tablet (md breakpoint) - default: 2 */
  itemsPerViewTablet?: number
  /** Enable auto-scroll - default: false */
  autoScroll?: boolean
  /** Auto-scroll interval in milliseconds - default: 5000 */
  autoScrollInterval?: number
  /** Show navigation arrows - default: true */
  showArrows?: boolean
  /** Show dots indicator - default: true */
  showDots?: boolean
  /** Additional CSS classes */
  className?: string
  /** Breakpoint to hide carousel (show grid instead) - default: 'lg' */
  hideFrom?: 'md' | 'lg' | 'xl' | 'none'
}

export default function Carousel ({
  children,
  itemsPerViewTablet = 2,
  autoScroll = false,
  autoScrollInterval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
  hideFrom = 'lg'
}: CarouselProps): ReactNode {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const itemsCount = children.length

  const handleTouchStart = (e: React.TouchEvent): void => {
    setTouchEnd(0) // Reset
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (): void => {
    if (touchStart === 0 || touchEnd === 0) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    }

    if (isRightSwipe) {
      goToPrevious()
    }
  }

  const goToSlide = (index: number): void => {
    setCurrentIndex(index)
  }

  const goToPrevious = (): void => {
    setCurrentIndex((prev) => (prev === 0 ? itemsCount - 1 : prev - 1))
  }

  const goToNext = (): void => {
    setCurrentIndex((prev) => (prev === itemsCount - 1 ? 0 : prev + 1))
  }

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === itemsCount - 1 ? 0 : prev + 1))
    }, autoScrollInterval)

    return () => { clearInterval(interval) }
  }, [autoScroll, autoScrollInterval, itemsCount])

  // Responsive class based on hideFrom prop
  const hideClass = hideFrom === 'none'
    ? ''
    : hideFrom === 'md'
      ? 'md:hidden'
      : hideFrom === 'xl'
        ? 'xl:hidden'
        : 'lg:hidden'

  return (
    <div className={`relative w-full ${hideClass} ${className}`}>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className='overflow-hidden'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className='flex transition-transform duration-500 ease-out'
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className={`w-full ${itemsPerViewTablet === 2 ? 'md:w-1/2' : itemsPerViewTablet === 3 ? 'md:w-1/3' : ''} flex-shrink-0 px-2 sm:px-4 flex items-stretch`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && itemsCount > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className='absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-white transition-all duration-200 z-10 touch-manipulation active:scale-95'
            aria-label='Previous slide'
          >
            <svg className='w-5 h-5 sm:w-6 sm:h-6 text-chestnut-deep' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className='absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-white transition-all duration-200 z-10 touch-manipulation active:scale-95'
            aria-label='Next slide'
          >
            <svg className='w-5 h-5 sm:w-6 sm:h-6 text-chestnut-deep' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && itemsCount > 1 && (
        <div className='flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6'>
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => { goToSlide(index) }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 touch-manipulation ${
                index === currentIndex
                  ? 'bg-autumn-cinnamon w-6 sm:w-8'
                  : 'w-1.5 sm:w-2 bg-chestnut-light hover:bg-chestnut-medium'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
