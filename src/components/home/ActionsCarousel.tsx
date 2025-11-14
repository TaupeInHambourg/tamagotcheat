/**
 * ActionsCarousel - Carousel for action cards on mobile/tablet
 *
 * Displays monster action cards in a swipeable carousel format
 * for better mobile experience using the generic Carousel component.
 *
 * Design Principles:
 * - Single Responsibility: Only handles action card rendering
 * - Open/Closed: Extensible through action items
 * - Dependency Inversion: Uses generic Carousel component
 *
 * @component
 */

'use client'

import { Carousel } from '@/components/common'

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
  // Prepare action cards for carousel
  const actionCards = actions.map((action, index) => (
    <div key={index} className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-6 sm:p-8 mx-auto w-full max-w-sm flex flex-col'>
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
  ))

  return (
    <Carousel
      itemsPerViewTablet={2}
      autoScroll
      autoScrollInterval={5000}
      showArrows
      showDots
      hideFrom='lg'
    >
      {actionCards}
    </Carousel>
  )
}
