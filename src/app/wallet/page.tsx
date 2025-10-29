import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AppLayout } from '@/components/navigation'

/**
 * Page Wallet - Gestion de la monnaie virtuelle
 *
 * Cette page sera développée prochainement pour permettre aux utilisateurs
 * de gérer leur monnaie virtuelle, acheter des items, etc.
 *
 * Responsabilité unique : Afficher le wallet de l'utilisateur
 *
 * @async
 * @returns {Promise<React.ReactNode>} Le contenu de la page ou une redirection
 *
 * @throws Redirige vers /sign-in si l'utilisateur n'est pas authentifié
 */
export default async function WalletPage (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  return (
    <AppLayout>
      <div className='py-12 px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-12'>
            <h1 className='text-5xl sm:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-4'>
              Mon Wallet 💰
            </h1>
            <p className='text-xl text-chestnut-medium leading-relaxed'>
              Gère ta monnaie virtuelle et tes achats
            </p>
          </div>

          <div className='max-w-3xl mx-auto'>
            <div className='bg-gradient-to-br from-autumn-cream to-autumn-peach/30 rounded-2xl shadow-md border border-autumn-peach p-12 text-center'>
              <div className='text-8xl mb-8'>🚧</div>
              <h2 className='text-4xl sm:text-5xl font-bold text-chestnut-deep leading-tight mb-8'>
                Page en construction
              </h2>
              <p className='text-2xl text-chestnut-medium leading-relaxed mb-10'>
                Le système de wallet arrive bientôt !
              </p>

              <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-autumn-peach/30 p-8 transition-all duration-300'>
                <p className='text-lg font-semibold text-chestnut-deep mb-6'>
                  Fonctionnalités à venir :
                </p>
                <ul className='text-left text-chestnut-medium leading-relaxed space-y-4'>
                  <li className='flex items-center gap-3'>
                    <span className='text-2xl'>💎</span>
                    <span>Gestion de ta monnaie virtuelle</span>
                  </li>
                  <li className='flex items-center gap-3'>
                    <span className='text-2xl'>🛒</span>
                    <span>Boutique d'items pour tes créatures</span>
                  </li>
                  <li className='flex items-center gap-3'>
                    <span className='text-2xl'>🎁</span>
                    <span>Récompenses quotidiennes</span>
                  </li>
                  <li className='flex items-center gap-3'>
                    <span className='text-2xl'>📊</span>
                    <span>Historique des transactions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
