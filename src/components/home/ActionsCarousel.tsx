/**
 * ActionsCarousel - Carousel for action cards on mobile/tablet
 *
 * Displays monster action cards in a swipeable carousel format
 * for better mobile experience.
 * - Mobile: 1 card per view
 * - Tablet: 2 cards per view
 * - Infinite loop navigation
 *
 * Design Principles:
 * - Single Responsibility: Only handles carousel display of actions
 * - Open/Closed: Extensible through action items
 * - Dependency Inversion: Depends on action interface
 *
 * @component
 */

'use client'

import { useState, useRef, useEffect } from 'react'

interface Action {
  icon: string
  title: string
  description: string
  xp: number
  color: 'autumn' | 'moss' | 'maple'
}

interface ActionsCarouselProps {
  actions: Action[]
}

export default function ActionsCarousel ({ actions }: ActionsCarouselProps): React.ReactNode {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

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
    setCurrentIndex((prev) => (prev === 0 ? actions.length - 1 : prev - 1))
  }

  const goToNext = (): void => {
    setCurrentIndex((prev) => (prev === actions.length - 1 ? 0 : prev + 1))
  }

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === actions.length - 1 ? 0 : prev + 1))
    }, 5000) // Change slide every 5 seconds

    return () => { clearInterval(interval) }
  }, [actions.length])

  return (
    <div className='relative w-full lg:hidden'>
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
          {actions.map((action, index) => (
            <div
              key={index}
              className='w-full md:w-1/2 flex-shrink-0 px-4 flex items-stretch'
            >
              <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-6 sm:p-8 mx-auto w-full max-w-sm flex flex-col'>
                <div className='text-4xl sm:text-5xl mb-4 sm:mb-6 text-center'>
                  {action.icon}
                </div>
                <h3 className='text-xl sm:text-2xl lg:text-3xl font-bold text-chestnut-deep leading-tight mb-3 sm:mb-4 text-center'>
                  {action.title}
                </h3>
                <p className='text-sm sm:text-base text-chestnut-medium leading-relaxed mb-3 sm:mb-4 text-center flex-grow'>
                  {action.description}
                </p>
                <div className='flex justify-center'>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
                      action.color === 'autumn'
                        ? 'bg-autumn-peach text-autumn-brown'
                        : action.color === 'moss'
                          ? 'bg-moss-pastel text-moss-deep'
                          : 'bg-maple-light text-maple-deep'
                    }`}
                  >
                    +{action.xp} XP
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200'
        aria-label='Previous slide'
      >
        <svg className='w-6 h-6 text-chestnut-deep' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200'
        aria-label='Next slide'
      >
        <svg className='w-6 h-6 text-chestnut-deep' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className='flex justify-center gap-2 mt-6'>
        {actions.map((_, index) => (
          <button
            key={index}
            onClick={() => { goToSlide(index) }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-autumn-cinnamon w-8'
                : 'bg-chestnut-light hover:bg-chestnut-medium'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
