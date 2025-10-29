import { getMonsterById } from '@/actions/monsters.actions'
import ErrorClient from '@/components/error-client'
import MonsterPageClient from '@/components/monsters/monster-page-client'
import { AppLayout } from '@/components/navigation'

export default async function Page ({ params }: { params: Promise<{ id: string | string[] }> }): Promise<React.ReactNode> {
  // Résolution asynchrone des params (Next.js 15 fournit des params awaités)
  const resolved = await params
  // Extraction de l'ID depuis les paramètres de route
  const id = Array.isArray(resolved.id) ? resolved.id[0] : resolved.id

  // Récupération du monstre depuis la base de données
  const monster = await getMonsterById(id)

  // Gestion du cas où le monstre n'existe pas
  if (monster === null || monster === undefined) {
    return (
      <AppLayout>
        <ErrorClient error='Creature not found.' />
      </AppLayout>
    )
  }

  // Affichage de la page de détail
  return (
    <AppLayout>
      <MonsterPageClient monster={monster} />
    </AppLayout>
  )
}
