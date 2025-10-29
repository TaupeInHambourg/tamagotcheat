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
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Mon Wallet 💰
          </h1>
          <p className='text-lg text-gray-600'>
            Gère ta monnaie virtuelle et tes achats
          </p>
        </div>

        <div className='max-w-2xl mx-auto'>
          <div className='bg-gradient-to-br from-pink-flare-100 to-pink-flare-200 rounded-2xl p-8 shadow-lg text-center'>
            <div className='text-8xl mb-6'>🚧</div>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Page en construction
            </h2>
            <p className='text-xl text-gray-700 mb-6'>
              Le système de wallet arrive bientôt !
            </p>
            <div className='bg-white/80 rounded-xl p-6'>
              <p className='text-gray-600 mb-4'>
                Fonctionnalités à venir :
              </p>
              <ul className='text-left text-gray-700 space-y-2'>
                <li>💎 Gestion de ta monnaie virtuelle</li>
                <li>🛒 Boutique d'items pour tes créatures</li>
                <li>🎁 Récompenses quotidiennes</li>
                <li>📊 Historique des transactions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
