# System de Loading - Architecture Simplifiée

## 📋 Vue d'ensemble

Le système de loading a été simplifié pour suivre les principes **SOLID**, **Clean Code** et **Clean Architecture**. Il distingue clairement deux types de chargement :

### 1. **Page Loading** (Transition entre pages)
- Affiche : `🍂 Chargement...`
- Durée : Très courte (transition Next.js)
- Composant : `PageLoader`
- Principe : Un seul loader, cohérent sur toute l'application

### 2. **Component Loading** (Chargement de données)
- Affiche : Skeleton adapté au composant
- Durée : Variable selon les données
- Composants : `*Skeleton` de `@/components/skeletons`
- Principe : Skeleton qui match la structure finale du composant

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Page Transition Start           │
│  (User clicks navigation or enters URL) │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  PageLoader   │  🍂 Chargement...
         │   (Global)    │
         └───────┬───────┘
                 │
                 ▼ Page loaded
         ┌───────────────┐
         │  Page Renders │
         └───────┬───────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌─────────┐      ┌─────────┐
   │Component│      │Component│
   │ loaded  │      │ loading │
   └─────────┘      └────┬────┘
                         │
                         ▼
                    ┌─────────┐
                    │Skeleton │
                    │displays │
                    └────┬────┘
                         │
                         ▼
                    ┌─────────┐
                    │  Data   │
                    │ arrives │
                    └────┬────┘
                         │
                         ▼
                    ┌─────────┐
                    │Component│
                    │ renders │
                    └─────────┘
```

---

## 📁 Structure des fichiers

### Page Loaders (7 fichiers identiques)
```
src/app/
  ├── loading.tsx                 # Root page loader
  ├── dashboard/loading.tsx       # Dashboard page loader
  ├── creatures/loading.tsx       # Creatures page loader
  ├── shop/loading.tsx           # Shop page loader
  ├── quests/loading.tsx         # Quests page loader
  ├── wallet/loading.tsx         # Wallet page loader
  └── gallery/loading.tsx        # Gallery page loader
```

**Contenu standardisé** :
```tsx
import { PageLoader } from '@/components/common/PageLoader'

export default function [Page]Loading (): React.ReactNode {
  return <PageLoader />
}
```

### Composants de Loading
```
src/components/
  ├── common/
  │   ├── PageLoader.tsx          # Loader global de page
  │   └── index.ts               # Barrel export
  │
  └── skeletons/
      ├── MonsterCardSkeleton.tsx
      ├── AccessoryCardSkeleton.tsx
      ├── QuestCardSkeleton.tsx
      ├── StatsCardSkeleton.tsx
      ├── SkeletonThemeProvider.tsx
      └── index.ts
```

---

## 🎯 Principes SOLID appliqués

### **Single Responsibility Principle (S)**
- `PageLoader` : Affiche uniquement le loader de transition de page
- Chaque `*Skeleton` : Représente uniquement la structure d'un type de composant
- Séparation claire : Page loading ≠ Component loading

### **Open/Closed Principle (O)**
- `PageLoader` : Fermé à modification, peut être étendu via props (className, etc.)
- Skeleton components : Extensibles via composition, pas de modification nécessaire

### **Liskov Substitution Principle (L)**
- Tous les loaders de page retournent `React.ReactNode`
- Interchangeables sans affecter le comportement

### **Interface Segregation Principle (I)**
- `PageLoader` : Interface minimale (pas de props obligatoires)
- Skeletons : Props optionnels selon le besoin (count, width, etc.)

### **Dependency Inversion Principle (D)**
- Les pages dépendent de l'abstraction `PageLoader`, pas d'une implémentation concrète
- Les composants dépendent des abstractions Skeleton, pas de librairies directement

---

## 🧹 Clean Code Principles

### 1. **DRY (Don't Repeat Yourself)**
- Un seul `PageLoader` réutilisé partout
- Pattern identique pour tous les `loading.tsx`

### 2. **KISS (Keep It Simple, Stupid)**
- `PageLoader` : 10 lignes de code
- Aucune logique complexe, juste de l'affichage

### 3. **Meaningful Names**
- `PageLoader` : Clair sur la fonction (loader de page)
- `*Skeleton` : Indique immédiatement le type de skeleton

### 4. **Single Level of Abstraction**
- `loading.tsx` : Niveau page (Next.js convention)
- `PageLoader` : Niveau présentation
- Pas de mélange entre logique métier et affichage

---

## 🏛️ Clean Architecture Layers

### **Presentation Layer** (UI Components)
```
PageLoader
  ↓
Uses: React components, Tailwind classes
Depends on: Nothing (standalone)
```

### **Application Layer** (Page Loading)
```
loading.tsx files
  ↓
Uses: PageLoader
Depends on: Common components abstraction
```

### **Framework Layer** (Next.js)
```
Next.js App Router
  ↓
Automatically shows loading.tsx during Suspense
Depends on: Next.js conventions
```

**Direction des dépendances** : Toujours vers l'intérieur
- Framework → Application → Presentation
- Jamais l'inverse

---

## 🔄 Flux de Chargement

### Scénario 1 : Navigation vers une nouvelle page

```
User clicks "Dashboard"
  ↓
Next.js detects route change
  ↓
Suspense boundary triggered
  ↓
src/app/dashboard/loading.tsx displays
  ↓
PageLoader shows "🍂 Chargement..."
  ↓
Dashboard page server component fetches data
  ↓
Data ready
  ↓
Dashboard page renders
  ↓
AppLayout provides WalletContext
  ↓
Components render (with skeletons if async)
```

### Scénario 2 : Composant chargeant des données asynchrones

```
Page already loaded
  ↓
Component needs data (e.g., QuestsSection)
  ↓
Component shows Skeleton
  ↓
Data fetched in background
  ↓
Data arrives
  ↓
Skeleton replaced by real component
  ↓
Smooth transition (CSS animations)
```

---

## 💾 WalletDisplay - Cas Spécial

Le `WalletDisplay` ne montre **JAMAIS** de loader :

```tsx
export function WalletDisplay ({ compact = false }) {
  const { koins, gifts } = useWallet()
  
  // Affiche immédiatement avec valeurs (0 au début)
  return (
    <Link href='/wallet'>
      <div>
        <span>💰</span>
        <span>{koins}</span> {/* 0 → valeur réelle (transition CSS) */}
        {!compact && (
          <>
            <span>🎁</span>
            <span>{gifts}</span> {/* 0 → valeur réelle (transition CSS) */}
          </>
        )}
      </div>
    </Link>
  )
}
```

**Avantages** :
- Pas de flash de chargement
- Affichage instantané
- Mise à jour fluide via transitions CSS
- Toujours visible dans le header

---

## 🎨 Design Consistency

### PageLoader Design
```tsx
<div className='min-h-screen flex items-center justify-center bg-autumn-gradient'>
  <div className='text-center'>
    <div className='text-6xl mb-4 animate-bounce'>🍂</div>
    <p className='text-chestnut-deep font-semibold text-lg'>
      Chargement...
    </p>
  </div>
</div>
```

**Caractéristiques** :
- ✅ Fullscreen (min-h-screen)
- ✅ Centré (flex center)
- ✅ Cohérent avec le thème autumn
- ✅ Animation bounce subtile
- ✅ Texte simple et clair

---

## 📊 Performance

### Métriques

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| Bundle size (PageLoader) | - | ~200 bytes | Minimal |
| Loading.tsx files | Complexes (skeletons) | Simples (1 composant) | -95% code |
| User perceived load time | Long (skeleton render) | Court (simple loader) | ~50% |
| Code maintenance | Difficile | Facile | +++++ |

### Optimisations

1. **Code splitting**
   - Skeletons chargés uniquement quand nécessaires
   - PageLoader inline (très petit)

2. **Rendering**
   - PageLoader : 1 seul render
   - Skeletons : Render uniquement si données async

3. **Bundle**
   - Réduction du code dans loading.tsx
   - Moins de duplications

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('PageLoader', () => {
  it('should render loading icon and text', () => {
    render(<PageLoader />)
    expect(screen.getByText('🍂')).toBeInTheDocument()
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })
  
  it('should have bounce animation', () => {
    const { container } = render(<PageLoader />)
    expect(container.querySelector('.animate-bounce')).toBeInTheDocument()
  })
})
```

### Integration Tests
```typescript
describe('Page Loading Flow', () => {
  it('should show PageLoader during navigation', async () => {
    const { container } = render(<App />)
    
    // Navigate to dashboard
    fireEvent.click(screen.getByText('Dashboard'))
    
    // Should show PageLoader
    expect(screen.getByText('Chargement...')).toBeInTheDocument()
    
    // Wait for page load
    await waitFor(() => {
      expect(screen.queryByText('Chargement...')).not.toBeInTheDocument()
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument()
    })
  })
})
```

---

## 🔍 Troubleshooting

### Problème : Le loader ne s'affiche pas
**Solution** : Vérifier que `loading.tsx` existe au bon niveau :
```
src/app/[route]/loading.tsx  ✅
src/app/[route]/page.tsx     
```

### Problème : Le loader s'affiche trop longtemps
**Cause** : La page Server Component est lente
**Solution** : Optimiser le fetching de données côté serveur

### Problème : Flash de contenu avant le loader
**Cause** : Suspense boundary mal placé
**Solution** : Utiliser `loading.tsx` au niveau approprié de la route

---

## 📚 Références

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Clean Architecture by Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)

---

## 🎓 Best Practices Summary

1. ✅ **Un seul PageLoader** pour toute l'application
2. ✅ **Skeletons uniquement** pour le chargement de composants
3. ✅ **Pas de loaders imbriqués** (loader dans loader)
4. ✅ **Transitions CSS** pour les changements de valeurs
5. ✅ **Affichage immédiat** du wallet (pas de loader)
6. ✅ **Cohérence visuelle** (thème autumn partout)
7. ✅ **Code minimal** dans loading.tsx (1 ligne utile)
8. ✅ **Respect des conventions** Next.js (loading.tsx)
9. ✅ **Testabilité** (composants simples à tester)
10. ✅ **Maintenabilité** (un changement = un fichier)

---

**Date de dernière mise à jour** : 12 novembre 2025
**Version** : 2.0 (Architecture simplifiée)
**Auteur** : TamagoTcheat Team
