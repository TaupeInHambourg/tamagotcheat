import { getMonsters } from '@/actions/monsters.actions'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import MonstersList from '@/components/monsters/monsters-list'
import { AppLayout } from '@/components/navigation'
import Link from 'next/link'
import Button from '@/components/Button'

/**
 * Page Creatures - Affiche toutes les créatures de l'utilisateur
 *
 * Cette page server-side vérifie l'authentification de l'utilisateur,
 * récupère toutes ses créatures depuis la base de données et les affiche
 * dans une liste.
 *
 * Responsabilité unique : Afficher la liste des créatures de l'utilisateur
 *
 * @async
 * @returns {Promise<React.ReactNode>} Le contenu de la page ou une redirection
 *
 * @throws Redirige vers /sign-in si l'utilisateur n'est pas authentifié
 */
export default async function CreaturesPage (): Promise<React.ReactNode> {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    redirect('/sign-in')
  }

  const monsters = await getMonsters()

  return (
    <AppLayout>
      <div className='py-12 px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header avec bouton boutique */}
          <div className='mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
            <div>
              <h1 className='text-5xl sm:text-6xl font-bold bg-gradient-to-r from-autumn-cinnamon via-autumn-terracotta to-maple-warm bg-clip-text text-transparent leading-tight mb-4'>
                Mes Créatures 🐾
              </h1>
              <p className='text-xl text-chestnut-medium leading-relaxed'>
                Retrouve toutes tes créatures adorables ici !
              </p>
            </div>
            <Link href='/shop'>
              <Button variant='primary' size='md'>
                <span className='flex items-center gap-2'>
                  <span>🛍️</span>
                  <span>Boutique</span>
                </span>
              </Button>
            </Link>
          </div>

          {monsters.length === 0
            ? (
              <div className='text-center py-20 bg-gradient-to-br from-autumn-cream to-autumn-peach/30 rounded-2xl shadow-md border border-autumn-peach'>
                <div className='text-8xl mb-8'>😢</div>
                <h2 className='text-3xl sm:text-4xl font-bold text-chestnut-deep leading-tight mb-6'>
                  Tu n'as pas encore de créature
                </h2>
                <p className='text-xl text-chestnut-medium leading-relaxed mb-8 max-w-md mx-auto'>
                  Retourne au dashboard pour créer ta première créature !
                </p>
                <div className='inline-block'>
                  <span className='inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-autumn-peach text-autumn-brown'>
                    🍂 Commence ton aventure
                  </span>
                </div>
              </div>
              )
            : (
              <div>
                <MonstersList monsters={monsters} />
              </div>
              )}
        </div>
      </div>
    </AppLayout>
  )
}
