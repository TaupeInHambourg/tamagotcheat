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
      <div className='section-cozy'>
        <div className='container-cozy'>
          <div className='mb-8 animate-fade-in-up'>
            <h1 className='heading-xl mb-2 text-gradient-autumn'>
              Mon Wallet 💰
            </h1>
            <p className='text-xl text-cosy'>
              Gère ta monnaie virtuelle et tes achats
            </p>
          </div>

          <div className='max-w-2xl mx-auto'>
            <div className='card-autumn p-12 text-center animate-scale-in'>
              <div className='text-8xl mb-6 animate-float'>🚧</div>
              <h2 className='heading-lg mb-6'>
                Page en construction
              </h2>
              <p className='text-2xl text-cosy mb-8'>
                Le système de wallet arrive bientôt !
              </p>

              <div className='card-cozy p-8 animate-slide-in-right'>
                <p className='text-lg font-semibold text-chestnut-deep mb-4'>
                  Fonctionnalités à venir :
                </p>
                <ul className='text-left text-cosy space-y-3'>
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
