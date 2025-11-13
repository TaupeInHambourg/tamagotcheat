---
sidebar_position: 1
---

# Welcome to TamagoTcheat

TamagoTcheat is a modern web-based virtual pet game built with Next.js, React, and MongoDB. Create, customize, and nurture your digital monsters while completing quests and collecting accessories.

## What is TamagoTcheat?

TamagoTcheat reimagines the classic virtual pet experience for the web. Players can:

- 🦎 **Create unique monsters** from various templates
- 😊 **Watch them evolve** through 5 different emotional states
- 🎯 **Complete quests** to earn rewards (daily and weekly)
- 🛍️ **Shop for accessories** and backgrounds to customize monsters
- 📈 **Level up** through an XP system
- 🌍 **Share** your creations in the public gallery

## Key Features

### Monster System
- **5 Emotional States**: Happy, Sad, Angry, Hungry, Sleepy
- **Real-time Updates**: Monster states change dynamically
- **XP & Leveling**: Progressive advancement system
- **Multiple Templates**: Various monster designs to choose from

### Customization
- **Accessories**: Hats, glasses, and shoes with 5 rarity levels
- **Backgrounds**: Themed scenes to enhance monster display
- **Equipment System**: Mix and match items
- **Visual Preview**: See changes in real-time

### Quest System
- **Daily Quests**: Fresh challenges every day
- **Weekly Quests**: Bigger goals with better rewards
- **Progress Tracking**: Real-time quest completion status
- **Dual Rewards**: Earn both Koins and Gifts

### Shop System
- **Dual Currency**: Free Koins and premium Gifts
- **Rarity Tiers**: Common to Legendary items
- **Filtering & Sorting**: Find items easily
- **Inventory Management**: Track owned items

## Technology Stack

### Frontend
- **Next.js 15**: App Router for modern React architecture
- **React 19**: Latest React features with server components
- **TypeScript**: Full type safety
- **TailwindCSS 4**: Custom autumn/cozy design system
- **Turbopack**: Ultra-fast builds and HMR

### Backend
- **MongoDB**: NoSQL database with Mongoose ODM
- **Better Auth**: Secure session-based authentication
- **Server Actions**: Type-safe API endpoints
- **Repository Pattern**: Clean data access layer

### Architecture
- **Clean Architecture**: Layered separation of concerns
- **SOLID Principles**: Maintainable and extensible code
- **Server Components**: Performance-first approach
- **Optimistic Updates**: Instant UI feedback

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/tamagotcheat.git
cd tamagotcheat

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Documentation Structure

This documentation is organized into several sections:

### 🏗️ [Architecture](./architecture/clean-architecture)
Learn about the Clean Architecture principles, SOLID patterns, and overall system design.

### 🧩 [Components](./components/overview)
Explore the component library with usage examples and best practices.

### ✨ [Features](./features/overview)
Deep dive into each feature: monsters, quests, shop, customization.

### 📚 [Guides](./guides/local-development)
Step-by-step tutorials for development, deployment, and contribution.

### 🔌 [API Reference](./api/overview)
Complete API documentation for server actions and services.

## Design Philosophy

### User Experience First
- **Intuitive Interface**: Clear navigation and actions
- **Instant Feedback**: Toast notifications and optimistic updates
- **Loading States**: Skeleton loaders for better perceived performance
- **Mobile Responsive**: Optimized for all screen sizes

### Code Quality
- **Type Safety**: TypeScript everywhere
- **Clean Code**: Readable and maintainable
- **DRY Principle**: Generic components reduce duplication
- **Consistent Style**: ts-standard linting enforced

### Performance
- **Server Components**: Fast initial loads
- **Image Optimization**: Next.js automatic optimization
- **Lazy Loading**: Components load on demand
- **Database Indexes**: Optimized queries

## Project Status

### Current Version: 1.0.0

**Completed Features**:
- ✅ Monster creation and management
- ✅ Accessory system (3 categories, 5 rarities)
- ✅ Background system
- ✅ Quest system (daily & weekly)
- ✅ Shop with dual currency
- ✅ XP and leveling
- ✅ Public gallery
- ✅ Dashboard with stats
- ✅ Mobile navigation

**In Development**:
- 🔄 Stripe payment integration
- 🔄 Achievement system
- 🔄 Social features (friends, sharing)

**Planned Features**:
- 📅 Monster battles
- 📅 Trading system
- 📅 Seasonal events
- 📅 Guild/clan system
- 📅 Leaderboards

## Contributing

We welcome contributions! See the [Contributing Guide](./guides/contributing) for details on:

- Code style and standards
- Pull request process
- Development workflow
- Testing requirements

## Community & Support

- **GitHub**: [Report issues](https://github.com/yourusername/tamagotcheat/issues)
- **Discussions**: [Community forum](https://github.com/yourusername/tamagotcheat/discussions)
- **Documentation**: You're reading it!

## License

MIT License - feel free to use this project for learning or as a base for your own projects.

## Next Steps

Ready to dive in? Here are some recommended paths:

### For Developers
1. Read [Local Development Guide](./guides/local-development)
2. Understand [Clean Architecture](./architecture/clean-architecture)
3. Explore [Component Library](./components/overview)
4. Review code in the repository

### For Contributors
1. Check [Contributing Guidelines](./guides/contributing)
2. Look at [open issues](https://github.com/yourusername/tamagotcheat/issues)
3. Join [discussions](https://github.com/yourusername/tamagotcheat/discussions)
4. Submit your first PR!

### For Users
1. Visit the [live demo](https://tamagotcheat.vercel.app)
2. Read [Features Overview](./features/overview)
3. Learn about [Quests](./features/quest-system)
4. Explore the [Shop System](./features/shop-system)

---

**Let's build amazing virtual pets together! 🦎✨**
