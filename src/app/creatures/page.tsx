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
      <div className='section-cozy'>
        <div className='container-cozy'>
          <div className='mb-8 animate-fade-in-up'>
            <h1 className='heading-xl mb-2 text-gradient-autumn'>
              Mes Créatures 🐾
            </h1>
            <p className='text-xl text-cozy'>
              Retrouve toutes tes créatures adorables ici !
            </p>
          </div>

          {monsters.length === 0
            ? (
              <div className='text-center py-16 card-autumn animate-scale-in'>
                <div className='text-8xl mb-6 animate-wiggle'>😢</div>
                <h2 className='heading-md mb-4'>
                  Tu n'as pas encore de créature
                </h2>
                <p className='text-xl text-cosy mb-6'>
                  Retourne au dashboard pour créer ta première créature !
                </p>
                <div className='inline-block'>
                  <span className='badge-autumn'>🍂 Commence ton aventure</span>
                </div>
              </div>
              )
            : (
              <div className='animate-fade-in-up'>
                <MonstersList monsters={monsters} />
              </div>
              )}
        </div>
      </div>
    </AppLayout>
  )
}
