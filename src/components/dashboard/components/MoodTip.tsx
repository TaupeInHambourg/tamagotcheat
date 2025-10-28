interface MoodTipProps {
  favoriteMoodMessage: string
}

export function MoodTip ({ favoriteMoodMessage }: MoodTipProps): React.ReactNode {
  return (
    <div className='group relative rounded-3xl bg-white p-6 shadow-md ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-lg'>
      {/* Icône simple */}
      <div className='absolute -right-2 -top-2 text-2xl'>🌙</div>

      <div className='relative'>
        <p className='flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-pink-flare-500'>
          <span>✨</span> Astuce mood
        </p>
        <p className='mt-3 text-base font-medium text-slate-800'>{favoriteMoodMessage}</p>
        <p className='mt-2 text-xs text-slate-600'>
          Observe tes créatures pour débloquer toutes les humeurs et récolter des surprises
        </p>
      </div>
    </div>
  )
}
