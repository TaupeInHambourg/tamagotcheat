import Button from '@/components/Button'
import { type Session } from '@/types/auth.types'

interface DashboardHeaderProps {
  displayName: string
  onCreateMonster: () => void
  onLogout: () => void
}

export function DashboardHeader ({ displayName, onCreateMonster, onLogout }: DashboardHeaderProps): React.ReactNode {
  return (
    <div className='relative flex flex-col gap-10 lg:flex-row lg:items-center'>
      <div className='group relative max-w-xl space-y-6'>
        {/* Badge de bienvenue animé */}
        <div className='relative inline-flex items-center gap-3 rounded-full border border-monsters-pink/30 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-pink-flare-500 shadow-sm transition-all duration-300 hover:border-monsters-purple/40 hover:shadow-md'>
          <div className='absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-monsters-pink/20 via-monsters-purple/20 to-monsters-blue/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100' />
          <span className='animate-pulse-slow' aria-hidden='true'>✨</span>
          <span>Coucou {displayName} !</span>
        </div>

        {/* Titre avec effet de surlignage */}
        <h1 className='relative text-4xl font-black text-pink-flare-700 drop-shadow-sm transition-all duration-300 sm:text-5xl'>
          <span className='relative z-10'>
            Bienvenue dans ton QG Tamagocheat
            <div className='absolute -bottom-2 left-0 -z-10 h-3 w-full scale-x-0 rounded-full bg-monsters-pink/20 transition-transform duration-500 group-hover:scale-x-100' />
          </span>
        </h1>

        {/* Description avec émojis animés */}
        <p className='relative text-base text-slate-600 sm:text-lg'>
          <span className='absolute -left-6 top-0 animate-float-slow text-xl'>🌟</span>
          Dompte des créatures adorables, surveille leur humeur et transforme chaque journée en mini-aventure numérique.
          <span className='absolute -right-6 bottom-0 animate-bounce-slow text-xl'>🎮</span>
        </p>

        {/* Boutons avec effets au survol */}
        <div className='flex flex-wrap items-center gap-3'>
          <Button
            size='lg'
            onClick={onCreateMonster}
            className='group/btn relative bg-gradient-to-r from-monsters-pink via-monsters-purple to-monsters-blue bg-[length:200%_100%] text-white transition-all duration-500 hover:bg-right-bottom hover:shadow-xl hover:shadow-monsters-pink/20'
          >
            <span className='absolute inset-0 -z-10 rounded-lg bg-white opacity-0 blur-md transition-opacity duration-300 group-hover/btn:opacity-30' />
            <span className='animate-pulse-slow mr-2'>✨</span> Créer une créature
          </Button>
          <Button
            size='lg'
            variant='ghost'
            onClick={onLogout}
            className='relative overflow-hidden text-pink-flare-600 transition-all duration-300 hover:bg-monsters-pink/10'
          >
            <span className='absolute inset-0 -z-10 bg-gradient-to-r from-monsters-pink/0 via-monsters-purple/10 to-monsters-blue/0 opacity-0 transition-opacity duration-300 hover:opacity-100' />
            <span className='animate-bounce-slow mr-2'>👋</span> Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  )
}
