# 🍂 TamagoTcheat Design System

## Vue d'ensemble

Ce design system s'inspire d'**Animal Crossing** et **Tamagotchi** pour créer une ambiance **cosy, cute et automnale** avec des couleurs pastels. Tous les styles sont centralisés dans `globals.css` pour respecter les principes SOLID.

## 🎨 Palette de couleurs

### Autumn Pastels (Principale)
- `autumn-cream`: #fef9f5 - Crème douce
- `autumn-peach`: #ffd4b8 - Pêche pastel
- `autumn-coral`: #ffb499 - Corail chaleureux
- `autumn-terracotta`: #e89b7f - Terre cuite
- `autumn-cinnamon`: #c97a5f - Cannelle
- `autumn-brown`: #a65d47 - Marron automnal

### Nature Greens (Mousse)
- `moss-light`: #e8f3e8 - Vert très clair
- `moss-pastel`: #c5ddc5 - Vert pastel
- `moss-soft`: #a8c8a8 - Vert doux
- `moss-medium`: #7da87d - Vert mousse
- `moss-deep`: #5a8a5a - Vert profond

### Warm Reds (Feuilles d'érable)
- `maple-blush`: #ffe5e5 - Rose poudré
- `maple-light`: #ffcaca - Rose clair
- `maple-soft`: #ffa5a5 - Rose doux
- `maple-warm`: #ff8585 - Rose chaud
- `maple-deep`: #d96b6b - Rose profond

### Cozy Browns (Châtaignes)
- `chestnut-cream`: #f5f0ea - Crème noisette
- `chestnut-light`: #e8dfd5 - Beige clair
- `chestnut-soft`: #d4c4b0 - Beige doux
- `chestnut-medium`: #b39b7f - Marron moyen
- `chestnut-dark`: #8b7355 - Marron foncé
- `chestnut-deep`: #6b5643 - Marron profond

### Pastel Accents (Playful)
- `pastel-lavender`: #e8d9ff - Lavande
- `pastel-mint`: #d9f5e8 - Menthe
- `pastel-sky`: #d9ebff - Ciel
- `pastel-lemon`: #fff9d9 - Citron
- `pastel-rose`: #ffd9e8 - Rose

### Monster Colors
- `monster-pink`: #ffb5d9
- `monster-blue`: #b5d9ff
- `monster-green`: #b5ffcc
- `monster-purple`: #d9b5ff
- `monster-orange`: #ffd9b5
- `monster-yellow`: #fff9b5

## 🎯 Classes Utility

### Cards
```css
.card-cozy         /* Carte standard avec effet hover */
.card-autumn       /* Carte avec gradient automnal */
```

### Buttons
```css
.btn-cozy          /* Base pour tous les boutons */
.btn-autumn        /* Bouton principal (coral → cinnamon) */
.btn-moss          /* Bouton secondaire (vert) */
.btn-maple         /* Bouton accent (rouge) */
.btn-soft          /* Bouton outline doux */
```

### Inputs
```css
.input-cozy        /* Input avec style automnal */
```

### Badges
```css
.badge-autumn      /* Badge pêche */
.badge-moss        /* Badge vert */
.badge-maple       /* Badge rouge */
```

### Containers
```css
.section-cozy      /* Section avec padding responsive */
.container-cozy    /* Container max-width centré */
```

### Backgrounds
```css
.bg-autumn-gradient    /* Gradient automnal */
.bg-cozy-pattern      /* Pattern de cercles subtils */
```

### Glass Effects
```css
.glass-autumn      /* Glassmorphism clair */
.glass-dark        /* Glassmorphism sombre */
```

### Shadows
```css
.shadow-cozy       /* Ombre douce */
.shadow-cozy-lg    /* Ombre douce large */
```

### Text
```css
.heading-cozy         /* Base pour titres */
.heading-xl          /* 5xl-6xl */
.heading-lg          /* 4xl-5xl */
.heading-md          /* 3xl-4xl */
.heading-sm          /* 2xl-3xl */
.text-cozy           /* Texte body */

/* Gradients */
.text-gradient-autumn   /* Gradient cinnamon → coral → maple */
.text-gradient-nature   /* Gradient moss → autumn */
```

### Effects
```css
.hover-lift        /* Hover avec scale + shadow */
.hover-glow        /* Hover avec glow */
.active-press      /* Active scale down */
.focus-cozy        /* Focus avec ring automnal */
```

## ✨ Animations

### Keyframes
- `float` - Flottement doux (3s)
- `wiggle` - Balancement (2s)
- `bounce-soft` - Rebond léger (2s)
- `pulse-soft` - Pulsation (2s)
- `shimmer` - Brillance
- `fade-in-up` - Apparition du bas (0.6s)
- `slide-in-right` - Glissement droite (0.6s)
- `scale-in` - Zoom in (0.4s)

### Classes d'animation
```css
.animate-float
.animate-wiggle
.animate-bounce-soft
.animate-pulse-soft
.animate-fade-in-up
.animate-slide-in-right
.animate-scale-in
```

## 📐 Spacing & Layout

### Responsive Padding
```css
.padding-cozy      /* px-4 py-3 → px-8 py-6 */
```

### Responsive Text
```css
.text-responsive-xl    /* 3xl → 6xl */
.text-responsive-lg    /* 2xl → 4xl */
.text-responsive-md    /* xl → 3xl */
```

## 🎨 Décoration

```css
.leaf-decoration::before   /* 🍂 en haut à gauche */
.sparkle-decoration::after /* ✨ en haut à droite */
```

## 🔤 Typographie

- **Font Family**: Geist Sans (système par défaut)
- **Font Mono**: Geist Mono
- **Line Heights**: Utiliser `leading-relaxed` ou `leading-tight`
- **Font Weights**: 
  - Normal: 400
  - Semibold: 600
  - Bold: 700

## 🎯 Principes d'utilisation

### ✅ À FAIRE
- Utiliser les classes utility pour la cohérence
- Combiner les animations avec parcimonie
- Privilégier les classes existantes avant d'en créer
- Utiliser les couleurs de la palette définie
- Ajouter des émojis pour le côté cute 🎮✨🍂

### ❌ À ÉVITER
- Créer des couleurs custom en dehors de la palette
- Multiplier les animations sur un même élément
- Utiliser des couleurs trop vives (rester pastel)
- Oublier les états hover/focus/active

## 📱 Responsive Design

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Mobile First**: Toujours commencer par le mobile
- **Navigation**: BottomNav (mobile) / AppHeader (desktop)
- **Spacing**: Utiliser les classes responsive de Tailwind

## 🎭 Composants principaux

### Navigation
- `AppHeader`: Navigation desktop (sticky top)
- `BottomNav`: Navigation mobile (fixed bottom)
- `AppLayout`: Layout wrapper pour pages authentifiées

### UI
- `Button`: Bouton avec 5 variantes
- `InputField`: Input avec label et erreur
- `Card`: Conteneurs cozy et autumn

## 🚀 Exemples d'usage

### Bouton principal
```tsx
<button className="btn-autumn shadow-cozy hover-lift">
  <span className="flex items-center gap-2">
    <span>Action</span>
    <span>✨</span>
  </span>
</button>
```

### Card animée
```tsx
<div className="card-cozy animate-scale-in">
  <h2 className="heading-md text-gradient-autumn">Titre</h2>
  <p className="text-cozy">Description...</p>
</div>
```

### Section complète
```tsx
<section className="section-cozy bg-autumn-gradient bg-cosy-pattern">
  <div className="container-cozy">
    <h1 className="heading-xl animate-fade-in-up">Titre</h1>
    {/* Contenu */}
  </div>
</section>
```

---

✨ **Créé avec amour pour une expérience cosy et automnale** 🍂
