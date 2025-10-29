import { getMonsters } from '@/actions/monsters.actions'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import MonstersList from '@/components/monsters/monsters-list'
import { AppLayout } from '@/components/navigation'

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
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Mes Créatures 🐾
          </h1>
          <p className='text-lg text-gray-600'>
            Retrouve toutes tes créatures adorables ici !
          </p>
        </div>

        {monsters.length === 0
          ? (
            <div className='text-center py-16'>
              <div className='text-6xl mb-4'>😢</div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Tu n'as pas encore de créature
              </h2>
              <p className='text-gray-600'>
                Retourne au dashboard pour créer ta première créature !
              </p>
            </div>
            )
          : (
            <MonstersList monsters={monsters} />
            )}
      </div>
    </AppLayout>
  )
}
