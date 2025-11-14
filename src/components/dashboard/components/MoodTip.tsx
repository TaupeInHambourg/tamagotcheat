interface MoodTipProps {
  favoriteMoodMessage: string
}

export function MoodTip ({ favoriteMoodMessage }: MoodTipProps): React.ReactNode {
  return (
    <div className='group relative rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-md ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-lg active:scale-[0.99] touch-manipulation'>
      {/* Icône simple */}
      <div className='absolute -right-1 sm:-right-2 -top-1 sm:-top-2 text-xl sm:text-2xl'>🌙</div>

      <div className='relative'>
        <p className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pink-flare-500'>
          <span className='text-sm sm:text-base'>✨</span> Astuce mood
        </p>
        <p className='mt-2 sm:mt-3 text-sm sm:text-base font-medium text-slate-800 leading-relaxed'>{favoriteMoodMessage}</p>
        <p className='mt-1.5 sm:mt-2 text-[11px] sm:text-xs text-slate-600 leading-relaxed'>
          Observe tes créatures pour débloquer toutes les humeurs et récolter des surprises
        </p>
      </div>
    </div>
  )
}
