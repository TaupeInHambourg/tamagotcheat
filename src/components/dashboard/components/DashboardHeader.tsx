import Button from '@/components/Button'
import Link from 'next/link'

interface DashboardHeaderProps {
  displayName: string
  onCreateMonster: () => void
  onLogout: () => void
}

export function DashboardHeader ({ displayName, onCreateMonster, onLogout }: DashboardHeaderProps): React.ReactNode {
  return (
    <div className='relative flex flex-col gap-6 sm:gap-10 lg:flex-row lg:items-center'>
      <div className='group relative max-w-xl space-y-4 sm:space-y-6'>
        {/* Badge de bienvenue animé - Plus compact sur mobile */}
        <div className='relative inline-flex items-center gap-2 sm:gap-3 rounded-full border border-monsters-pink/30 bg-white/90 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-pink-flare-500 shadow-sm transition-all duration-300 hover:border-monsters-purple/40 hover:shadow-md'>
          <div className='absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-monsters-pink/20 via-monsters-purple/20 to-monsters-blue/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100' />
          <span className='animate-pulse-slow text-sm sm:text-base' aria-hidden='true'>✨</span>
          <span>Coucou {displayName} !</span>
        </div>

        {/* Titre avec effet de surlignage - Plus petit sur mobile */}
        <h1 className='relative text-2xl sm:text-4xl font-black drop-shadow-sm transition-all duration-300 lg:text-5xl leading-tight' style={{ color: '#a65d47' }}>
          <span className='relative z-10'>
            Bienvenue dans ton QG Tamagocheat
            <div className='absolute -bottom-2 left-0 -z-10 h-2 sm:h-3 w-full scale-x-0 rounded-full bg-monsters-pink/20 transition-transform duration-500 group-hover:scale-x-100' />
          </span>
        </h1>

        {/* Description avec émojis animés - Masquer émojis sur mobile */}
        <p className='relative text-sm sm:text-base lg:text-lg px-1 sm:px-0'>
          <span className='hidden sm:block absolute -left-6 top-0 animate-float-slow text-xl'>🌟</span>
          Dompte des créatures adorables, surveille leur humeur et transforme chaque journée en mini-aventure numérique.
          <span className='hidden sm:block absolute -right-6 bottom-0 animate-bounce-slow text-xl'>🎮</span>
        </p>

        {/* Boutons avec effets au survol - Layout optimisé mobile */}
        <div className='flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3'>
          <Button
            size='md'
            className='sm:size-lg w-full sm:w-auto'
            onClick={onCreateMonster}
          >
            <span className='mr-2'>✨</span> Créer une créature
          </Button>
          <Link href='/gallery?source=dashboard' className='w-full sm:w-auto'>
            <Button
              size='md'
              className='sm:size-lg w-full'
              variant='secondary'
            >
              <span className='mr-2'>🌍</span> Galerie publique
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
