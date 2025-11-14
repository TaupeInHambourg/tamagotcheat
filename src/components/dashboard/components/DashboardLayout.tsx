interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout ({ children }: DashboardLayoutProps): React.ReactNode {
  return (
    <div className='relative min-h-screen bg-rose-20 overflow-x-hidden'>
      {/* Bulles décoratives */}
      <div className='animate-float-slow pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-monsters-purple/30 blur-3xl' aria-hidden='true' />
      <div className='animate-float pointer-events-none absolute -left-32 bottom-24 h-80 w-80 rounded-full bg-monsters-green/40 blur-3xl' aria-hidden='true' />
      <div className='animate-float-slow pointer-events-none absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-monsters-pink/30 blur-2xl' aria-hidden='true' />
      <div className='animate-bounce-slow pointer-events-none absolute left-1/4 top-1/2 h-32 w-32 rounded-full bg-monsters-blue/30 blur-xl' aria-hidden='true' />

      {/* Motifs kawaii */}
      <div className='pointer-events-none absolute inset-0 opacity-10 overflow-hidden'>
        <div className='absolute left-10 top-20 h-16 w-16 rotate-12 text-8xl'>🌟</div>
        <div className='absolute right-32 top-40 h-16 w-16 -rotate-12 text-8xl'>✨</div>
        <div className='absolute bottom-40 left-1/3 h-16 w-16 rotate-45 text-6xl'>🌸</div>
        <div className='absolute bottom-20 right-1/4 h-16 w-16 -rotate-12 text-6xl'>🍡</div>
      </div>

      <main className='relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 pb-28'>
        <section className='relative rounded-[2rem]'>
          {/* Effets de lumière internes */}
          <div className='animate-pulse-slow pointer-events-none absolute -right-28 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-monsters-pink/40 via-monsters-blue/30 to-white/40 blur-3xl' aria-hidden='true' />
          <div className='animate-pulse-slow pointer-events-none absolute -left-32 bottom-0 h-64 w-64 translate-y-1/2 rounded-full bg-gradient-to-tr from-monsters-green/40 via-white/30 to-monsters-purple/40 blur-3xl' aria-hidden='true' />

          {/* Bordure décorative */}
          <div className='pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-monsters-pink/20 to-monsters-purple/20 opacity-50' aria-hidden='true' />

          {children}
        </section>
      </main>
    </div>
  )
}
