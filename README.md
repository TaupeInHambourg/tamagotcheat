# TamagoTcheat 🍂

A modern virtual pet (Tamagotchi-like) web application built with Next.js, featuring real-time monster state management, accessories, quests, and a shop system.

## 🎯 Project Overview

TamagoTcheat is a full-stack web application that brings the nostalgic Tamagotchi experience to the modern web. Users can adopt virtual monsters, customize them with accessories and backgrounds, complete daily and weekly quests, and watch their creatures evolve through an XP-based leveling system.

### Key Features

- **🐾 Monster Management**: Create and care for virtual monsters with dynamic state changes
- **🎨 Customization System**: Equip accessories (hats, glasses, shoes) and backgrounds
- **🎯 Quest System**: Complete daily and weekly quests to earn rewards
- **🛍️ Shop**: Purchase accessories and backgrounds with in-game currency (Koins)
- **📊 XP & Leveling**: Progressive leveling system with experience points
- **🎭 Monster States**: Dynamic emotional states (happy, sad, angry, hungry, sleepy)
- **💰 Dual Currency**: Koins (earned through quests) and Gifts (premium currency)
- **📱 Responsive Design**: Optimized for mobile and desktop with adaptive navigation

## 🏗️ Architecture

The project follows **Clean Architecture** and **SOLID principles**:

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS
- **Backend**: Server Actions, MongoDB (Mongoose ODM)
- **Authentication**: Better Auth with session management
- **State Management**: React Context + Server-side state
- **Styling**: TailwindCSS 4 with custom autumn/cozy theme
- **Code Quality**: TypeScript strict mode, ts-standard linting

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components (organized by feature)
├── actions/            # Server actions for data mutations
├── db/                 # Database layer (models, repositories)
├── services/           # Business logic layer
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── config/             # Application configuration
└── contexts/           # React contexts
```

## 🚀 Local Setup

### Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **MongoDB**: 6.x or higher (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TaupeInHambourg/tamagotcheat.git
   cd tamagotcheat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file at the root with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/tamagotcheat
   
   # Better Auth
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=http://localhost:3000
   
   # Stripe (optional, for premium features)
   STRIPE_SECRET_KEY=your-stripe-secret-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting and auto-fix
npm run lint
```

## 📦 Deployment

The application is optimized for deployment on **Vercel**:

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Environment Variables (Production)

Ensure all environment variables from `.env.local` are configured in your Vercel project settings.

### Database

For production, use **MongoDB Atlas**:
- Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Whitelist Vercel's IP addresses or use 0.0.0.0/0 (less secure)
- Update `MONGODB_URI` with your Atlas connection string

## 🎨 Design System

The application uses a custom **autumn/cozy** color palette:

- **Primary Colors**: Autumn Peach, Coral, Cinnamon
- **Neutral Colors**: Chestnut range (light to deep)
- **Accent Colors**: Moss green, Maple warm
- **Typography**: Nunito (body), Geist Mono (code), Sour Gummy (display)

## 📚 Documentation

Comprehensive technical documentation is available via **Docusaurus**.

### Accessing the Documentation

1. **Navigate to the documentation folder**
   ```bash
   cd documentation
   ```

2. **Install documentation dependencies** (first time only)
   ```bash
   npm install
   ```

3. **Start the documentation server**
   ```bash
   npm start
   ```

4. **Open your browser**
   
   The documentation site will automatically open at [http://localhost:3000](http://localhost:3000)

### Documentation Contents

The documentation includes:

- **🏗️ Architecture**: Clean Architecture principles, SOLID patterns, and design decisions
- **🧩 Components**: Complete component library with usage examples and props documentation
- **✨ Features**: In-depth guides for monster system, quests, shop, and customization
- **📚 Guides**: Step-by-step tutorials for development, deployment, and contribution
- **🔌 API Reference**: Server actions, services, and repository documentation

### Building Documentation for Production

```bash
cd documentation
npm run build
npm run serve
```

The built documentation can be deployed separately or hosted on platforms like Netlify or Vercel.

## 🧪 Testing

The codebase follows strict TypeScript typing and includes:
- Type safety with strict mode
- ESLint with ts-standard
- Component-level prop validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

- Design inspired by classic Tamagotchi virtual pets
- Built with modern web technologies and best practices
- Follows Clean Architecture and SOLID principles

---

Made with ❤️ and 🍂 by [TaupeInHambourg](https://github.com/TaupeInHambourg)
