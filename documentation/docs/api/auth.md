---
sidebar_position: 1
---

# Authentication API

API for user authentication and session management in TamagoTcheat.

## Overview

The Authentication API handles user sign-up, sign-in, sign-out, and session management. TamagoTcheat uses NextAuth.js (Auth.js) for authentication.

**Base Library**: `src/lib/auth.ts`  
**Auth Client**: `src/lib/auth-client.ts`

## Configuration

### Auth Setup

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate credentials
        const user = await validateUser(credentials)
        return user
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    }
  }
})
```

## Authentication Methods

### Sign In with Google

```tsx
'use client'

import { signIn } from 'next-auth/react'

function GoogleSignIn() {
  const handleSignIn = async () => {
    await signIn('google', {
      callbackUrl: '/dashboard'
    })
  }

  return (
    <button onClick={handleSignIn}>
      Sign in with Google
    </button>
  )
}
```

### Sign In with Credentials

```tsx
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

function CredentialsSignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        window.location.href = '/dashboard'
      }
    } catch (error) {
      setError('An error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  )
}
```

### Sign Out

```tsx
'use client'

import { signOut } from 'next-auth/react'

function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/'
    })
  }

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  )
}
```

## Session Management

### Get Current Session (Server)

```typescript
import { auth } from '@/lib/auth'

export default async function ServerComponent() {
  const session = await auth()

  if (!session) {
    return <p>Not authenticated</p>
  }

  return <p>Welcome, {session.user?.name}</p>
}
```

### Get Current Session (Client)

```tsx
'use client'

import { useSession } from 'next-auth/react'

function ClientComponent() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (!session) {
    return <p>Not authenticated</p>
  }

  return <p>Welcome, {session.user?.name}</p>
}
```

## Protected Routes

### Server Component Protection

```typescript
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>User ID: {session.user.id}</p>
    </div>
  )
}
```

### Client Component Protection

```tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function ProtectedClientPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return <div>Protected content</div>
}
```

## Server Actions with Auth

```typescript
'use server'

import { auth } from '@/lib/auth'

export async function protectedAction() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      success: false,
      error: 'Authentication required'
    }
  }

  // Perform protected action
  const userId = session.user.id

  return {
    success: true,
    data: { /* ... */ }
  }
}
```

## Middleware Protection

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth

  // Public routes
  const publicRoutes = ['/', '/sign-in', '/sign-up']
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // Redirect unauthenticated users
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl))
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (nextUrl.pathname === '/sign-in' || nextUrl.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

## Environment Variables

```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
MONGODB_URI=your-mongodb-connection-string
```

## Session Type Extension

```typescript
// types/next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
  }
}
```

## Error Handling

```tsx
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

function SignInForm() {
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (credentials: Credentials) => {
    try {
      setError(null)
      
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false
      })

      if (result?.error) {
        // Handle specific errors
        switch (result.error) {
          case 'CredentialsSignin':
            setError('Invalid email or password')
            break
          case 'OAuthAccountNotLinked':
            setError('Email already in use with different provider')
            break
          default:
            setError('An error occurred during sign in')
        }
      } else {
        window.location.href = '/dashboard'
      }
    } catch (error) {
      setError('An unexpected error occurred')
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSignIn({ /* ... */ })
    }}>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {/* Form fields */}
    </form>
  )
}
```

## Best Practices

### Do's
✅ Always validate session on protected routes  
✅ Use server-side auth checks for sensitive data  
✅ Implement proper error handling  
✅ Use HTTPS in production  
✅ Store secrets securely  
✅ Implement rate limiting  

### Don'ts
❌ Don't trust client-side authentication alone  
❌ Don't expose sensitive data in session  
❌ Don't store passwords in plain text  
❌ Don't skip CSRF protection  
❌ Don't use weak secrets  

## Related Documentation

- [Monsters API](./monsters) - Protected monster operations
- [Architecture](../architecture/overview) - System architecture

## Security Considerations

1. **Session Security**
   - Sessions are encrypted
   - Secure cookies in production
   - Automatic session refresh

2. **CSRF Protection**
   - Built-in CSRF protection
   - Token validation on requests

3. **Password Handling**
   - Passwords are hashed (bcrypt)
   - Never log passwords
   - Enforce strong password policies

4. **OAuth Security**
   - Validate OAuth tokens
   - Use state parameter
   - Verify redirect URIs
