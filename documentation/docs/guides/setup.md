---
sidebar_position: 1
---

# Development Setup

Get your Tamagotcheat development environment up and running.

## Prerequisites

### Required Software

- **Node.js**: v18.17 or higher
- **npm**: v9 or higher (comes with Node.js)
- **MongoDB**: v6 or higher (local or Atlas)
- **Git**: Latest version

### Verify Installation

```bash
node --version   # Should be v18.17+
npm --version    # Should be v9+
git --version    # Any recent version
```

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/tamagotcheat.git
cd tamagotcheat
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15.5.4
- React 19.1.0
- TypeScript
- TailwindCSS 4
- Mongoose
- Better-auth

### 3. Environment Configuration

Create `.env.local` file in the project root:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/tamagotcheat
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tamagotcheat

# Authentication
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Optional: OAuth providers (if using social login)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Generate Auth Secret

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
net start MongoDB
```

3. Verify connection:

```bash
mongosh
# Should connect to mongodb://localhost:27017
```

#### Option B: MongoDB Atlas (Cloud)

1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Get connection string
4. Whitelist your IP address
5. Create database user
6. Update `MONGODB_URI` in `.env.local`

### 5. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## Project Structure

```
tamagotcheat/
├── src/
│   ├── actions/          # Server actions (API layer)
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Landing page
│   │   ├── dashboard/    # Dashboard route
│   │   └── api/          # API routes (auth)
│   ├── components/       # React components
│   ├── db/               # Database layer
│   │   ├── models/       # Mongoose models
│   │   └── repositories/ # Data access layer
│   ├── services/         # Business logic layer
│   ├── lib/              # Utilities & helpers
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── public/               # Static assets
├── documentation/        # Docusaurus docs
└── node_modules/         # Dependencies
```

## Available Scripts

### Development

```bash
# Start dev server with Turbopack
npm run dev

# Start on different port
PORT=3001 npm run dev
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# Lint TypeScript (ts-standard)
npm run lint

# Fix linting errors
npm run lint:fix

# Type check
npm run type-check
```

### Documentation

```bash
# Start documentation site
cd documentation
npm start

# Build documentation
npm run build
```

## IDE Setup

### VS Code (Recommended)

#### Required Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### WebStorm / IntelliJ

1. Enable TypeScript support
2. Enable ESLint
3. Enable TailwindCSS intellisense plugin

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
# macOS/Linux
lsof -ti:3000

# Windows
netstat -ano | findstr :3000

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
# macOS/Linux
ps aux | grep mongod

# Windows
tasklist | findstr mongod

# Check connection string format
# Local: mongodb://localhost:27017/dbname
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Check tsconfig.json is correct
npm run type-check
```

### Environment Variables Not Loading

- Restart dev server after changing `.env.local`
- Ensure no typos in variable names
- Check `.env.local` is in project root
- Don't commit `.env.local` to Git

## Next Steps

1. [Architecture Overview](../architecture/overview) - Understand the codebase structure
2. [API Documentation](../api/overview) - Learn how to use Server Actions
3. [Component Guide](../components/overview) - Explore UI components
4. [Contributing Guide](./contributing) - Start contributing

## Common Development Tasks

### Create a New Component

```bash
# Create component file
mkdir -p src/components/MyComponent
touch src/components/MyComponent/MyComponent.tsx
touch src/components/MyComponent/index.ts
```

```tsx
// MyComponent.tsx
interface MyComponentProps {
  title: string
}

export default function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>
}
```

```tsx
// index.ts
export { default as MyComponent } from './MyComponent'
```

### Create a New Page

```bash
# App Router structure
mkdir -p src/app/my-page
touch src/app/my-page/page.tsx
```

```tsx
// page.tsx
export default function MyPage() {
  return <h1>My Page</h1>
}
```

### Add a New Server Action

```tsx
// src/actions/my-feature.actions.ts
'use server'

import { auth } from '@/lib/auth'

export async function myAction(data: MyData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }
  
  // Your logic here
  
  return { success: true, data: result }
}
```

### Create a New Service

```tsx
// src/services/interfaces/my-service.interface.ts
export interface IMyService {
  doSomething(): Promise<OperationResult<MyData>>
}

// src/services/implementations/my-service.ts
export class MyService implements IMyService {
  async doSomething() {
    // Business logic
    return { success: true, data: result }
  }
}

// src/services/index.ts
export function getMyService(): IMyService {
  return new MyService()
}
```

## Getting Help

- 📚 [Documentation](http://localhost:3000/docs)
- 🐛 [Issue Tracker](https://github.com/yourusername/tamagotcheat/issues)
- 💬 [Discussions](https://github.com/yourusername/tamagotcheat/discussions)
- 📧 Email: support@tamagotcheat.com
