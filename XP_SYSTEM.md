# Système d'Expérience (XP) - Documentation

## Vue d'ensemble

Le système d'XP permet aux créatures de gagner de l'expérience et de monter de niveau en fonction des interactions et des actions effectuées par l'utilisateur. Ce système suit les principes **SOLID**, **Clean Code** et **Clean Architecture**.

## Architecture

### Fichiers créés/modifiés

1. **`src/utils/xp-system.ts`** - Logique métier du système d'XP (pure functions)
2. **`src/components/monsters/LevelProgressBar.tsx`** - Composant de barre de progression visuelle
3. **`src/db/models/monster.model.ts`** - Schéma Mongoose mis à jour avec les champs XP
4. **`src/types/monster.types.ts`** - Types TypeScript mis à jour
5. **`src/services/implementations/monster.service.ts`** - Service ajoutant l'XP lors des interactions
6. **`src/actions/accessories.actions.ts`** - Action ajoutant l'XP lors de l'équipement d'accessoires

## Gains d'XP

### Par action
| Action | XP gagné |
|--------|----------|
| Jouer (play) | 10 XP |
| Nourrir (feed) | 15 XP |
| Dormir (sleep) | 5 XP |
| Câliner (cuddle) | 10 XP |
| Équiper un accessoire | 20 XP |

### Progression des niveaux

- **Formule** : `niveau * 100 XP`
- Niveau 1 → 2 : 100 XP
- Niveau 2 → 3 : 200 XP
- Niveau 3 → 4 : 300 XP
- etc.
- **Niveau maximum** : 50

## Modèle de données

### Champs ajoutés au Monster schema

```typescript
{
  level: Number,              // Niveau actuel (défaut: 1)
  experience: Number,         // XP dans le niveau actuel (0 à XP requis)
  totalExperience: Number     // XP total accumulé (jamais diminué)
}
```

## Composants UI

### LevelProgressBar

Affiche :
- Badge de niveau avec gradient (pink → purple → blue)
- Barre de progression animée
- XP actuel / XP requis
- Pourcentage de progression

**Utilisation** :
```tsx
<LevelProgressBar
  level={monster.level ?? 1}
  currentXP={monster.experience ?? 0}
  xpForNextLevel={calculateLevelFromXP(monster.totalExperience ?? 0).xpForNextLevel}
/>
```

## Fonctions utilitaires

### `calculateLevelFromXP(totalXP: number)`
Calcule le niveau actuel et l'XP dans le niveau à partir de l'XP total.

### `addXP(currentTotalXP: number, xpToAdd: number)`
Ajoute de l'XP et retourne les nouvelles valeurs (niveau, XP, level-up?).

### `getLevelProgress(currentXP: number, xpForNextLevel: number)`
Calcule le pourcentage de progression (0-100%) pour la barre.

## Principes respectés

### SOLID
- **S** (Single Responsibility) : Chaque fonction fait une seule chose
- **O** (Open/Closed) : Extensible sans modification (ajout de nouvelles actions)
- **D** (Dependency Inversion) : Utilisation d'interfaces et de repositories

### Clean Code
- Fonctions pures sans effets de bord
- Noms explicites et auto-documentés
- Documentation complète avec JSDoc
- Gestion d'erreurs appropriée

### Clean Architecture
- **Domain Layer** : Types et interfaces (`monster.types.ts`)
- **Use Case Layer** : Logique métier (`xp-system.ts`)
- **Interface Layer** : Composants React (`LevelProgressBar.tsx`)
- **Data Layer** : Mongoose models (`monster.model.ts`)

## Exemple de flux

1. **Utilisateur interagit** avec une créature (ex: "Nourrir")
2. **Service** (`monster.service.ts`) calcule l'XP gagné
3. **Utilitaire** (`xp-system.ts`) calcule le nouveau niveau/XP
4. **Repository** met à jour la base de données
5. **Composant** (`LevelProgressBar`) affiche la progression

## Tests suggérés

- [ ] Tester les calculs XP avec différentes valeurs
- [ ] Vérifier la progression de niveau (1→2, 2→3, etc.)
- [ ] Tester le niveau maximum (cap à 50)
- [ ] Vérifier l'affichage de la barre de progression
- [ ] Tester les gains XP pour chaque action
- [ ] Vérifier l'XP lors de l'équipement d'accessoires

## Améliorations futures possibles

- [ ] Animations de level-up (modal, confettis)
- [ ] Sons/effets lors du gain d'XP
- [ ] Déblocage de capacités par niveau
- [ ] Système de récompenses par niveau
- [ ] Classement/leaderboard par niveau
- [ ] Boost d'XP temporaires
- [ ] Événements double XP

## Inspiré par

Ce système est basé sur le projet exemple :
https://github.com/RiusmaX/v0-tamagotcho/

Avec des adaptations pour correspondre à l'architecture TamagoTcheat.
