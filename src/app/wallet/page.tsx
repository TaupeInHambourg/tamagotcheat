import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/navigation'
import { getUserKoins } from '@/db/models/user.model'
import { KOINS_PACKAGES, formatPrice } from '@/config/koins.config'

/**
 * Page Wallet - Gestion de la monnaie virtuelle
 *
 * Affiche le solde de Koins et les packages disponibles à l'achat.
 * Utilise Stripe pour les paiements sécurisés.
 *
 * Responsabilité unique : Afficher le wallet et les options d'achat
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

  // Récupérer le solde actuel
  const currentKoins = await getUserKoins(session.user.id)

  return (
    <AppLayout>
      <div className='py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* En-tête avec solde */}
          <div className='mb-8 sm:mb-10 lg:mb-12 text-center'>
            <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-3 sm:mb-4'>
              Mon Wallet 💰
            </h1>
            <p className='text-base sm:text-lg lg:text-xl text-chestnut-medium leading-relaxed mb-4 sm:mb-6'>
              Gère ta monnaie virtuelle et tes achats
            </p>

            {/* Solde actuel */}
            <div className='inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-autumn-cream to-autumn-peach/50 rounded-full px-6 py-3 sm:px-8 sm:py-4 shadow-lg border border-autumn-peach'>
              <span className='text-3xl sm:text-4xl'>💰</span>
              <div className='text-left'>
                <div className='text-xs sm:text-sm text-chestnut-medium uppercase tracking-wide'>
                  Solde
                </div>
                <div className='text-2xl sm:text-3xl font-bold text-chestnut-deep'>
                  {currentKoins} Koins
                </div>
              </div>

            </div>
          </div>

          {/* Packages disponibles */}
          <div className='max-w-5xl mx-auto mt-8 sm:mt-10 lg:mt-12'>
            <h2 className='text-2xl sm:text-3xl font-bold text-chestnut-deep mb-6 sm:mb-8 text-center'>
              Acheter des Koins
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
              {KOINS_PACKAGES.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/wallet/checkout?package=${pkg.id}`}
                  className='group relative bg-gradient-to-br from-autumn-cream to-autumn-peach/30 rounded-2xl shadow-md border-2 border-autumn-peach/30 p-5 sm:p-6 hover:shadow-xl hover:scale-105 transition-all duration-300'
                >
                  {/* Badge populaire */}
                  {(pkg.popular ?? false) && (
                    <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                      <div className='bg-gradient-to-r from-maple-warm to-autumn-terracotta text-white text-xs sm:text-sm font-bold px-3 py-0.5 sm:px-4 sm:py-1 rounded-full shadow-md'>
                        ⭐ Populaire
                      </div>
                    </div>
                  )}

                  {/* Contenu */}
                  <div className='text-center'>
                    <div className='text-5xl sm:text-6xl mb-3 sm:mb-4'>{pkg.emoji}</div>
                    <h3 className='text-xl sm:text-2xl font-bold text-chestnut-deep mb-2'>
                      {pkg.name}
                    </h3>
                    <p className='text-xs sm:text-sm text-chestnut-medium mb-3 sm:mb-4'>
                      {pkg.description}
                    </p>
                    <div className='text-3xl sm:text-4xl font-bold text-chestnut-deep mb-2'>
                      {pkg.koins}
                    </div>
                    <div className='text-base sm:text-lg text-chestnut-medium mb-3 sm:mb-4'>
                      Koins
                    </div>
                    <div className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-maple-warm to-autumn-terracotta bg-clip-text text-transparent'>
                      {formatPrice(pkg.priceInCents)}
                    </div>
                  </div>

                  {/* Indicateur meilleure valeur */}
                  {pkg.koins >= 500 && (
                    <div className='mt-3 sm:mt-4 text-center text-xs sm:text-sm text-maple-warm font-semibold'>
                      🎁 Meilleure valeur !
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
