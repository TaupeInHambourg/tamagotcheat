# 🚀 Guide d'Intégration Rapide

## Étape 1 : Tester le Système ✅

### Lancer la page de démo
```bash
# Démarrer le serveur de développement
npm run dev

# Visiter la page de démo
# http://localhost:3000/demo/accessories
```

Cette page affiche tous les 17 accessoires avec leurs previews animées.

## Étape 2 : Intégrer dans une Page Monstre 🎯

### Option A : Affichage Simple (Lecture seule)

Remplacer l'image SVG par le composant avec accessoires :

```tsx
// AVANT
<Image src={monster.draw} alt={monster.name} width={200} height={200} />

// APRÈS
import { MonsterWithAccessories } from '@/components/monsters'

<MonsterWithAccessories
  monsterId={monster._id}
  imageSrc={monster.draw}
  state={monster.state}
  size={200}
/>
```

### Option B : Avec Panel de Gestion (Page Créature)

```tsx
'use client'

import { useState } from 'react'
import { MonsterWithAccessories } from '@/components/monsters'
import { AccessoryPanel } from '@/components/accessories'
import { getCreatureEquipment } from '@/actions/accessories.actions'

export default function CreaturePage({ params }: { params: { id: string } }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [equipment, setEquipment] = useState({ hat: null, glasses: null, shoes: null })

  // Charger l'équipement au montage
  useEffect(() => {
    const loadEquipment = async () => {
      const eq = await getCreatureEquipment(params.id)
      setEquipment(eq)
    }
    void loadEquipment()
  }, [params.id, refreshTrigger])

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne Gauche : Monstre */}
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold">Mon Monstre</h2>
          <MonsterWithAccessories
            monsterId={params.id}
            imageSrc="/assets/tamagocheats/chat-cosmique/happy.svg"
            state="happy"
            size={300}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Colonne Droite : Accessoires */}
        <div>
          <AccessoryPanel
            monsterId={params.id}
            equipment={equipment}
            onAccessoriesChange={() => setRefreshTrigger(prev => prev + 1)}
          />
        </div>
      </div>
    </div>
  )
}
```

## Étape 3 : Ajouter dans les Cartes de Monstre 📇

Pour afficher les accessoires dans les cartes de liste, utilisez `MonsterCard` ou `PublicMonsterCard` qui intègrent déjà `MonsterWithAccessories` :

```tsx
// src/components/monsters/monster-card.tsx (déjà intégré)
import { MonsterWithAccessories } from './MonsterWithAccessories'

export function MonsterCard({ initialMonster }: Props) {
  return (
    <article className="card">
      <MonsterWithAccessories
        monsterId={monster.id}
        imageSrc={currentAsset}
        state={monster.state}
        size={200}
      />
      {/* ... reste du contenu */}
    </article>
  )
}
```

## Étape 4 : Créer la Boutique 🛒

### Page Shop Basique

```tsx
// src/app/shop/page.tsx
'use client'


import { useState } from 'react'
import { ACCESSORIES_CATALOG, getAccessoryPrice } from '@/config/accessories.config'
import { AccessoryPreview } from '@/components/accessories'
import { purchaseAccessory } from '@/actions/accessories.actions'

export default function ShopPage() {
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const handlePurchase = async (accessoryId: string) => {
    setPurchasing(accessoryId)
    try {
      const result = await purchaseAccessory(accessoryId)
      if (result.success) {
        alert('Accessoire acheté ! 🎉')
      } else {
        alert(`Erreur : ${result.error}`)
      }
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">🛒 Boutique d'Accessoires</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {ACCESSORIES_CATALOG.map(accessory => {
          const price = getAccessoryPrice(accessory)
          
          return (
            <div key={accessory.id} className="border rounded-lg p-4">
              <AccessoryPreview
                accessoryId={accessory.id}
                category={accessory.category}
                rarity={accessory.rarity}
                size={100}
              />
              <h3 className="font-semibold mt-2">{accessory.name}</h3>
              <p className="text-sm text-gray-600">{accessory.description}</p>
              <button
                onClick={() => handlePurchase(accessory.id)}
                disabled={purchasing === accessory.id}
                className="mt-2 w-full bg-blue-500 text-white rounded px-4 py-2"
              >
                {purchasing === accessory.id ? 'Achat...' : `${price} 💰`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

## Étape 5 : Activer le Système de Paiement 💰

Décommenter le débit de Koins dans `purchaseAccessory` :

```typescript
// src/actions/accessories.actions.ts

export async function purchaseAccessory(accessoryId: string) {
  // ... validation ...

  // DÉCOMMENTER CES LIGNES :
  // const price = getAccessoryPrice(accessoryInfo)
  // const walletResult = await subtractKoins(session.user.id, price)
  // if (!walletResult.success) {
  //   return { success: false, error: 'Koins insuffisants' }
  // }

  // ... reste du code ...
}
```

## Étape 6 : Vérifications MongoDB 🗄️

Assurez-vous que la collection `accessories` existe :

```javascript
// Dans MongoDB Compass ou Shell
use tamagotcheat

// Créer des index pour performance
db.accessories.createIndex({ ownerId: 1, accessoryId: 1 }, { unique: true })
db.accessories.createIndex({ equippedOnMonsterId: 1 })
db.accessories.createIndex({ ownerId: 1, equippedOnMonsterId: 1 })
```

## Étape 7 : Tests Rapides 🧪

### Test 1 : Voir tous les accessoires
```
URL: /demo/accessories
Résultat attendu: 17 accessoires affichés avec previews animées
```

### Test 2 : Acheter un accessoire
```typescript
// Dans la console du navigateur
const result = await fetch('/api/accessories/purchase', {
  method: 'POST',
  body: JSON.stringify({ accessoryId: 'hat-crown' })
})
console.log(await result.json())
```

### Test 3 : Équiper un accessoire
```typescript
// Supposant que vous avez l'ID de l'accessoire en DB
const result = await fetch('/api/accessories/equip', {
  method: 'POST',
  body: JSON.stringify({
    accessoryDbId: '...',
    monsterId: '...'
  })
})
```

## 🐛 Résolution de Problèmes

### Les accessoires ne s'affichent pas
1. Vérifier que MongoDB contient bien des accessoires pour l'utilisateur
2. Vérifier que `equippedOnMonsterId` est défini
3. Ouvrir la console : erreurs Canvas ou fetch ?

### Erreur "accessoryId not found"
- L'ID dans la DB doit matcher un ID du `ACCESSORIES_CATALOG`
- Vérifier les typos : `hat-crown` vs `hat_crown`

### Accessoires ne se rafraîchissent pas
- Utiliser `refreshTrigger` ou callback `onAccessoriesChange`
- Vérifier que `refresh()` est appelé dans le hook

### Canvas vide
- Vérifier que `imageSrc` pointe vers un SVG valide
- Ouvrir DevTools > Canvas : voir si le Canvas est créé
- Vérifier la console : erreurs de chargement d'image ?

## 📚 Ressources

- **Documentation complète** : `ACCESSORIES_SYSTEM.md`
- **Résumé implémentation** : `ACCESSORIES_IMPLEMENTATION.md`
- **Code source** :
  - Rendu : `src/utils/accessory-renderer.ts`
  - Composants : `src/components/accessories/`
  - Hooks : `src/hooks/accessories/`
  - Actions : `src/actions/accessories.actions.ts`
  - DB : `src/db/models/accessory.model.ts`

## 🎉 C'est Tout !

Votre système d'accessoires est **opérationnel** ! 

Prochaines étapes suggérées :
1. ✅ Tester `/demo/accessories`
2. ✅ Intégrer dans une page monstre
3. ✅ Créer la boutique
4. ✅ Ajouter plus d'accessoires
5. ✅ Implémenter le système de backgrounds

**Bon dev ! 🚀**
