# Système d'Intégration des Accessoires Pixel Art

## Vue d'ensemble

Les accessoires sont maintenant **directement intégrés dans le SVG des créatures** tout en conservant leur **style pixel art**. Les animations des créatures ne sont pas modifiées et les accessoires suivent parfaitement ces animations.

## Architecture

### 🎯 Approche Hybride SVG + Canvas

```
┌─────────────────────────────────────────────┐
│   Monster SVG (avec animations CSS)         │
│                                              │
│   ┌────────────────────────────────────┐   │
│   │  .monster-body (groupe animé)      │   │
│   │                                     │   │
│   │  ┌──────────────────────────────┐ │   │
│   │  │ Accessoires (pixel art)      │ │   │
│   │  │ - Rendus en Canvas           │ │   │
│   │  │ - Convertis en data URI      │ │   │
│   │  │ - Intégrés comme <image>     │ │   │
│   │  │ - Héritent des animations    │ │   │
│   │  └──────────────────────────────┘ │   │
│   └────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Composants Clés

### 1. `accessory-to-data-uri.ts`

**Responsabilité** : Convertir les accessoires pixel art en images base64

```typescript
accessoryToDataURI(accessoryId, category, pixelSize) → data URI
```

**Processus** :
1. Crée un Canvas temporaire
2. Dessine l'accessoire en pixel art (même logique que `accessory-renderer.ts`)
3. Convertit le Canvas en data URI PNG : `canvas.toDataURL('image/png')`
4. Retourne l'image encodée en base64

**Avantages** :
- ✅ Préserve le style pixel art exact
- ✅ Réutilise la logique de rendu existante
- ✅ Compatible avec SVG `<image>` elements

### 2. `PixelMonster.tsx` (modifié)

**Responsabilité** : Intégrer les accessoires dans le SVG du monstre

**Processus** :
```typescript
1. fetch(imageSrc) // Charge le SVG du monstre
2. DOMParser.parseFromString() // Parse le SVG
3. Pour chaque accessoire équipé :
   a. accessoryToDataURI() // Génère l'image pixel art
   b. createElementNS('image') // Crée un élément <image> SVG
   c. setAttribute('href', dataURI) // Lie l'image
   d. Position calculée depuis monster-accessory-positions.config.ts
   e. appendChild() dans .monster-body
4. XMLSerializer.serializeToString() // Sérialise le SVG modifié
5. dangerouslySetInnerHTML // Affiche le résultat
```

**Clés du succès** :
- Les accessoires sont ajoutés **à l'intérieur de `.monster-body`**
- Ils **héritent automatiquement** des transformations CSS du parent
- L'attribut `image-rendering: pixelated` préserve le style pixel art

## Exemple de Rendu Final

```xml
<svg viewBox="0 0 32 32">
  <style>
    @keyframes sway {
      0%, 100% { transform: rotate(-2deg); }
      50% { transform: rotate(2deg); }
    }
  </style>
  
  <g class="monster-body" style="animation: sway 3s ease-in-out infinite;">
    <!-- Corps du monstre (SVG original) -->
    <rect x="10" y="10" width="12" height="12" fill="#C5E1FF"/>
    
    <!-- Accessoires ajoutés dynamiquement -->
    <g class="accessories-layer">
      <!-- Chaussures -->
      <image 
        href="data:image/png;base64,iVBORw0KG..." 
        x="8" y="24" 
        width="16" height="16"
        style="image-rendering: pixelated;"
      />
      
      <!-- Lunettes -->
      <image 
        href="data:image/png;base64,iVBORw0KG..." 
        x="8" y="14" 
        width="12" height="12"
        style="image-rendering: pixelated;"
      />
      
      <!-- Chapeau -->
      <image 
        href="data:image/png;base64,iVBORw0KG..." 
        x="6" y="-2" 
        width="20" height="20"
        style="image-rendering: pixelated;"
      />
    </g>
  </g>
</svg>
```

## Avantages de cette Approche

### ✅ Style Pixel Art Préservé
- Canvas API avec `imageSmoothingEnabled = false`
- `image-rendering: pixelated` en CSS SVG
- Même rendu exact que le système Canvas précédent

### ✅ Animations Intactes
- Les animations CSS du monstre ne sont **jamais modifiées**
- Les accessoires héritent des transformations via le DOM SVG
- Synchronisation parfaite : `rotate()`, `translateY()`, `scale()`

### ✅ Performance
- Une seule génération de data URI par accessoire
- Pas de `requestAnimationFrame` loop
- Utilise le moteur d'animation CSS natif du navigateur

### ✅ Maintenabilité
- Séparation claire : rendu pixel art (`accessory-to-data-uri`) vs intégration (`PixelMonster`)
- Réutilise la configuration existante (`monster-accessory-positions.config.ts`)
- Compatible avec les fonctions de rendu existantes

## Configuration des Positions

Utilise toujours `monster-accessory-positions.config.ts` :

```typescript
{
  'chat-cosmique': {
    hat: { x: 50, y: 18.75, scale: 1.2 },
    glasses: { x: 50, y: 43.75, scale: 2.0 },
    shoes: { x: 50, y: 81.25, scale: 1.5 },
    animation: { type: 'sway', duration: 3, params: { rotationRange: 2 } }
  }
}
```

Les pourcentages sont convertis en coordonnées viewBox (32x32) lors de l'intégration.

## Tests Recommandés

1. **Vérifier le rendu pixel art** : Les accessoires doivent garder leurs bords nets
2. **Tester les animations** : Les accessoires doivent bouger avec le monstre
3. **Différents types** : Tester hat, glasses, shoes sur chaque créature
4. **Échelles** : Vérifier que les scales (100%, 150%, 200%, 220%) fonctionnent

## Migration depuis l'Ancien Système

L'ancien système Canvas-overlay est **complètement remplacé** :

**Avant** :
```tsx
<div>
  <img src="monster.svg" />
  <canvas /> {/* Overlay avec requestAnimationFrame */}
</div>
```

**Après** :
```tsx
<div dangerouslySetInnerHTML={{
  __html: modifiedSVG /* SVG avec accessoires intégrés */
}} />
```

## Fichiers Modifiés

- ✅ `src/utils/accessory-to-data-uri.ts` (nouveau)
- ✅ `src/components/monsters/PixelMonster.tsx` (refactoré)
- ⚠️ `src/utils/accessory-renderer.ts` (conservé pour référence)
- ⚠️ `src/utils/accessory-svg-generator.ts` (non utilisé, peut être supprimé)
