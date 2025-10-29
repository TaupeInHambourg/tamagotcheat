import { Geist, Geist_Mono } from 'next/font/google'
// import { MonstersAutoUpdater } from '@/components/monsters/auto-updater'
// import { auth } from '@/lib/auth'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.JSX.Element> {
  // Get current user session for auto-updater
  // const { headers } = await import('next/headers')
  // const session = await auth.api.getSession({
  //   headers: await headers()
  // })

  return (
    <html lang='fr'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Auto-updater disabled - using individual lazy state decay instead */}
        {/*
        <MonstersAutoUpdater
          userId={session?.user?.id}
          minInterval={60000}
          maxInterval={180000}
          enabled
          verbose
          showIndicator
        />
        */}
      </body>
    </html>
  )
}
