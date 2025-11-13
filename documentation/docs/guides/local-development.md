# Local Development Guide

Complete guide for setting up TamagoTcheat locally.

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+**: [Download Node.js](https://nodejs.org/)
- **npm 9+**: Comes with Node.js
- **MongoDB**: Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **Git**: [Download Git](https://git-scm.com/)
- **Code Editor**: VS Code recommended

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

This installs:
- Next.js 15.5.4
- React 19.1.0
- MongoDB/Mongoose
- Better Auth
- TailwindCSS 4
- TypeScript
- And all other dependencies

### 3. Environment Configuration

Create `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/tamagotcheat
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tamagotcheat

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (optional - for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Generate Auth Secret

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 4. Database Setup

#### Local MongoDB

1. Install MongoDB Community Edition:
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. Start MongoDB service:
   ```bash
   # Linux/Mac
   sudo systemctl start mongod
   
   # Windows (as service)
   net start MongoDB
   ```

3. Verify connection:
   ```bash
   mongosh
   ```

#### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user (Database Access)
4. Whitelist IP address (Network Access) or use `0.0.0.0/0` for development
5. Get connection string from "Connect" button
6. Replace `<username>` and `<password>` in connection string
7. Add connection string to `.env.local`

### 5. Seed Database (Optional)

Populate database with initial data:

```bash
npm run db:seed
```

This creates:
- Sample monsters
- Accessories (all categories and rarities)
- Backgrounds
- Quest configurations

## Development

### Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

Features enabled:
- Hot Module Replacement (HMR)
- Turbopack for fast builds
- Auto-refresh on code changes
- Error overlay

### Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Landing page
│   ├── dashboard/    # Dashboard route
│   ├── creatures/    # Monster management
│   ├── shop/         # Shop interface
│   └── quests/       # Quest list
├── components/       # React components
│   ├── common/       # Shared components
│   ├── monsters/     # Monster-specific
│   ├── shop/         # Shop components
│   └── skeletons/    # Loading states
├── actions/          # Server actions
├── services/         # Business logic
├── db/               # Database layer
│   ├── models/       # Mongoose schemas
│   └── repositories/ # Data access
├── hooks/            # Custom React hooks
├── types/            # TypeScript types
└── utils/            # Utility functions
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ts-standard linter
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript type checking

# Database
npm run db:seed      # Seed database
npm run db:reset     # Reset database
npm run db:migrate   # Run migrations

# Documentation
cd documentation
npm install
npm start            # Start Docusaurus dev server
npm run build        # Build documentation
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow the [architecture guidelines](../architecture/clean-architecture.md):

```
1. Create/update types (src/types/)
2. Update database models (src/db/models/)
3. Implement repository methods (src/db/repositories/)
4. Add business logic (src/services/)
5. Create server actions (src/actions/)
6. Build UI components (src/components/)
7. Create/update pages (src/app/)
```

### 3. Test Changes

```bash
# Run linter
npm run lint

# Check types
npm run type-check

# Test in browser
npm run dev
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

## Common Development Tasks

### Add New Component

1. Create component file:
   ```tsx
   // src/components/monsters/NewComponent.tsx
   interface NewComponentProps {
     title: string;
   }
   
   export function NewComponent({ title }: NewComponentProps) {
     return <div>{title}</div>;
   }
   ```

2. Export from index:
   ```tsx
   // src/components/monsters/index.ts
   export { NewComponent } from './NewComponent';
   ```

3. Use in page:
   ```tsx
   import { NewComponent } from '@/components/monsters';
   ```

### Add New Server Action

1. Create action:
   ```tsx
   // src/actions/monsters.actions.ts
   'use server'
   
   export async function doSomething(id: string) {
     const result = await monsterService.doSomething(id);
     return result;
   }
   ```

2. Use in component:
   ```tsx
   'use client'
   
   import { doSomething } from '@/actions/monsters.actions';
   
   const handleClick = async () => {
     await doSomething(monsterId);
   };
   ```

### Add New Database Model

1. Create schema:
   ```tsx
   // src/db/models/newmodel.model.ts
   import { Schema, model } from 'mongoose';
   
   interface INewModel {
     name: string;
     value: number;
   }
   
   const NewModelSchema = new Schema({
     name: { type: String, required: true },
     value: { type: Number, required: true }
   });
   
   export const NewModel = model<INewModel>('NewModel', NewModelSchema);
   ```

2. Create repository:
   ```tsx
   // src/db/repositories/implementations/newmodel.repository.ts
   export class NewModelRepository implements INewModelRepository {
     async findById(id: string) {
       return await NewModel.findById(id);
     }
   }
   ```

### Add New Route

1. Create page:
   ```tsx
   // src/app/newroute/page.tsx
   export default async function NewRoutePage() {
     return (
       <main>
         <h1>New Route</h1>
       </main>
     );
   }
   ```

2. Add navigation link:
   ```tsx
   // src/components/Header.tsx
   <Link href="/newroute">New Route</Link>
   ```

## Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Chrome DevTools

1. Open DevTools (F12)
2. Navigate to Sources tab
3. Find your file in webpack://
4. Set breakpoints
5. Interact with app to trigger breakpoint

### Server Logs

```tsx
// In server components or actions
console.log('Debug info:', variable);
```

Logs appear in terminal where `npm run dev` is running.

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Issues

```bash
# Check MongoDB is running
mongosh

# Check connection string in .env.local
# Verify username/password for Atlas
# Whitelist IP in Atlas Network Access
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> TypeScript: Restart TS Server

# Check types
npm run type-check
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## Performance Tips

### Optimize Images

Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/monster.svg"
  alt="Monster"
  width={200}
  height={200}
  priority={true}  // For above-fold images
/>
```

### Lazy Load Components

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Skeleton />}>
  <HeavyComponent />
</Suspense>
```

### Optimize Database Queries

```tsx
// Add indexes
MonsterSchema.index({ userId: 1, level: -1 });

// Use select to limit fields
Monster.findById(id).select('name level xp');

// Use lean for read-only
Monster.find().lean();
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)

## Next Steps

1. Read [Architecture Guide](../architecture/clean-architecture.md)
2. Review [Component Library](../components/overview.md)
3. Understand [Shop System](../features/shop-system.md)
4. Learn [Quest System](../features/quest-system.md)
5. Check [Design System](./setup.md)
