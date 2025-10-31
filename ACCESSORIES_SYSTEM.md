# Système d'Accessoires Pixel Art

## Vue d'ensemble

Le système d'accessoires a été adapté de [RiusmaX/v0-tamagotcho](https://github.com/RiusmaX/v0-tamagotcho) pour permettre l'équipement d'accessoires en pixel art sur les monstres.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRÉSENTATION (UI)                        │
├─────────────────────────────────────────────────────────────┤
│  AccessoryPanel → AccessorySlot → AccessorySelector         │
│  AccessoryPreview → PixelMonster → MonsterWithAccessories   │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  APPLICATION (Hooks)                         │
├─────────────────────────────────────────────────────────────┤
│  use-accessories.ts → use-equip-accessory.ts                │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  DOMAIN (Actions)                            │
├─────────────────────────────────────────────────────────────┤
│  accessories.actions.ts (Server Actions)                     │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│               INFRASTRUCTURE (DB)                            │
├─────────────────────────────────────────────────────────────┤
│  accessory.model.ts (MongoDB operations)                     │
└─────────────────────────────────────────────────────────────┘
```

## Composants créés

### 1. Système de rendu (`src/utils/accessory-renderer.ts`)

Fonctions pures pour dessiner les accessoires pixel par pixel sur Canvas :

```typescript
// Dessiner un accessoire spécifique
drawAccessory(ctx, accessoryId, category, x, y, pixelSize, frame)

// Dessiner un accessoire centré (pour previews)
drawAccessoryCentered(ctx, accessoryId, category, width, height, pixelSize, frame)

// Dessiner tous les accessoires équipés sur un monstre
drawEquippedAccessories(ctx, accessories, bodyY, centerX, pixelSize, frame)
```

**Caractéristiques :**
- Mapping ID → couleur automatique
- Support d'animations (paramètre `frame`)
- Coordonnées pixel par pixel pour chaque accessoire
- Architecture extensible (Open/Closed Principle)

### 2. Composants de rendu

#### `AccessoryPreview.tsx`
Preview d'un accessoire seul, utilisé dans la boutique et les sélecteurs.

```tsx
<AccessoryPreview
  accessoryId="hat-crown"
  category="hat"
  rarity="legendary"
  size={128}
/>
```

#### `PixelMonster.tsx`
Rendu hybride : SVG pour le monstre + Canvas pour les accessoires.

```tsx
<PixelMonster
  imageSrc="/assets/tamagocheats/chat-cosmique/happy.svg"
  state="happy"
  accessories={{
    hat: 'hat-crown',
    glasses: 'glasses-sun',
    shoes: 'shoes-sneakers'
  }}
  size={160}
/>
```

**Pourquoi hybride ?**
- Conserve les assets SVG existants des monstres
- Ajoute les accessoires en pixel art par-dessus
- Pas besoin de redessiner tous les monstres

#### `MonsterWithAccessories.tsx`
Wrapper intelligent qui charge automatiquement les accessoires équipés depuis la DB.

```tsx
<MonsterWithAccessories
  monsterId="monster_123"
  imageSrc="/assets/tamagocheats/chat-cosmique/happy.svg"
  state="happy"
/>
```

### 3. Composants d'interface

#### `AccessorySlot.tsx`
Affiche un emplacement d'accessoire (chapeau, lunettes, chaussures).

```tsx
<AccessorySlot
  category="hat"
  equipped={currentHat}
  onSelectAccessory={(cat) => openSelector(cat)}
  onUnequip={(id) => unequip(id)}
/>
```

#### `AccessorySelector.tsx`
Modal de sélection d'accessoires filtrés par catégorie.

```tsx
<AccessorySelector
  category="hat"
  ownedAccessories={myAccessories}
  onSelect={(id) => equipAccessory(id)}
  onClose={() => setShowSelector(false)}
/>
```

#### `AccessoryPanel.tsx`
Panel complet de gestion des 3 emplacements.

```tsx
<AccessoryPanel
  monsterId="monster_123"
  equipment={currentEquipment}
  onAccessoriesChange={() => refreshMonster()}
/>
```

## Utilisation

### Dans une page de monstre

```tsx
'use client'

import { MonsterWithAccessories } from '@/components/monsters/MonsterWithAccessories'
import { AccessoryPanel } from '@/components/accessories/AccessoryPanel'
import { useCreatureEquipment } from '@/hooks/use-creature-equipment' // À créer si besoin

export default function CreaturePage({ params }: { params: { id: string } }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { equipment } = useCreatureEquipment(params.id)
  
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Affichage du monstre avec accessoires */}
      <div>
        <MonsterWithAccessories
          monsterId={params.id}
          imageSrc="/assets/tamagocheats/chat-cosmique/happy.svg"
          state="happy"
          refreshTrigger={refreshTrigger}
        />
      </div>
      
      {/* Panel de gestion des accessoires */}
      <div>
        <AccessoryPanel
          monsterId={params.id}
          equipment={equipment}
          onAccessoriesChange={() => setRefreshTrigger(prev => prev + 1)}
        />
      </div>
    </div>
  )
}
```

### Dans la boutique

```tsx
import { AccessoryPreview } from '@/components/accessories/AccessoryPreview'
import { ACCESSORIES_CATALOG } from '@/config/accessories.config'

export function Shop() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {ACCESSORIES_CATALOG.map(accessory => (
        <div key={accessory.id}>
          <AccessoryPreview
            accessoryId={accessory.id}
            category={accessory.category}
            rarity={accessory.rarity}
          />
          <p>{accessory.name}</p>
          <button onClick={() => purchaseAccessory(accessory.id)}>
            Acheter
          </button>
        </div>
      ))}
    </div>
  )
}
```

## Design des accessoires

Chaque accessoire est dessiné avec des coordonnées pixel précises. Voici les designs actuels :

### Chapeaux (Hats)
- **Crown** (`hat-crown`) : Couronne dorée avec gemmes jaunes
- **Cowboy** (`hat-cowboy`) : Chapeau marron à large bord
- **Cap** (`hat-cap`) : Casquette bleue sportive
- **Wizard** (`hat-wizard`) : Chapeau pointu violet avec étoiles
- **Party** (`hat-party`) : Chapeau de fête rose conique
- **Beret** (`hat-beret`) : Béret rouge français

### Lunettes (Glasses)
- **Sun** (`glasses-sun`) : Lunettes de soleil noires
- **Nerd** (`glasses-nerd`) : Lunettes rondes marron
- **Heart** (`glasses-heart`) : Lunettes en forme de cœur rose
- **Monocle** (`glasses-monocle`) : Monocle doré avec chaînette
- **3D** (`glasses-3d`) : Lunettes rouge/cyan

### Chaussures (Shoes)
- **Sneakers** (`shoes-sneakers`) : Baskets rouges avec bandes blanches
- **Boots** (`shoes-boots`) : Bottes marron hautes
- **Ballet** (`shoes-ballet`) : Chaussons roses de danse
- **Roller** (`shoes-roller`) : Patins violets avec roues animées
- **Heels** (`shoes-heels`) : Talons rouges élégants
- **Flip-flops** (`shoes-flip-flops`) : Tongs orange décontractées

## Animations

Certains accessoires ont des animations :
- **Roller skates** : Roues qui tournent
- Extensible à d'autres (ailes qui battent, halos lumineux, etc.)

Les animations utilisent le paramètre `frame` dans `Math.sin()` :

```typescript
const wheelOffset = Math.abs(Math.sin(frame * 0.15)) * 2
ctx.fillRect(x, y + wheelOffset, pixelSize, pixelSize)
```

## Ajout d'un nouvel accessoire

1. **Ajouter au catalogue** (`src/config/accessories.config.ts`) :
```typescript
{
  id: 'hat-pirate',
  name: 'Chapeau de Pirate',
  category: 'hat',
  emoji: '🏴‍☠️',
  rarity: 'epic',
  basePrice: 15,
  description: 'Yo ho ho !',
  style: { top: '-15%', left: '50%', transform: 'translateX(-50%)' }
}
```

2. **Ajouter la couleur** (`src/utils/accessory-renderer.ts`) :
```typescript
function getAccessoryColor(accessoryId: string): string {
  // ...
  if (accessoryId.includes('pirate')) return '#2C2C2C' // Black
  // ...
}
```

3. **Dessiner le pixel art** (dans `drawHat()`) :
```typescript
else if (accessoryId.includes('pirate')) {
  // Tricorne pirate hat
  ctx.fillRect(x - 21, y - 12, pixelSize * 7, pixelSize)
  ctx.fillRect(x - 18, y - 15, pixelSize * 6, pixelSize)
  ctx.fillStyle = '#FFFFFF' // White skull
  ctx.fillRect(x - 3, y - 18, pixelSize * 2, pixelSize * 2)
}
```

## Migration des composants existants

Pour utiliser le nouveau système sur vos composants existants :

### Avant (SVG uniquement)
```tsx
<Image
  src={monster.draw}
  alt={monster.name}
  width={200}
  height={200}
/>
```

### Après (SVG + Accessoires)
```tsx
<MonsterWithAccessories
  monsterId={monster._id}
  imageSrc={monster.draw}
  state={monster.state}
  size={200}
/>
```

## Performance

- Canvas rendering à 60fps pour les animations
- Cleanup automatique des animations au unmount
- Style `imageRendering: 'pixelated'` pour le rendu pixel perfect
- Lazy loading des accessoires (chargés uniquement quand affichés)

## Prochaines étapes

1. **Intégrer dans MonsterCard** : Afficher les accessoires équipés dans les cards de liste
2. **Page de boutique** : Interface complète d'achat d'accessoires
3. **Wallet integration** : Décommenter le débit de Koins dans `purchaseAccessory`
4. **Plus d'accessoires** : Ajouter plus de designs (ailes, queues, bijoux, etc.)
5. **Backgrounds** : Système similaire pour les arrière-plans personnalisables
6. **Achievements** : Débloquer des accessoires rares via succès

## Références

- [Dépôt d'origine v0-tamagotcho](https://github.com/RiusmaX/v0-tamagotcho)
- [Documentation Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Architecture Clean](../DESIGN_SYSTEM.md)
