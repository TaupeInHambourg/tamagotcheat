import { Geist_Mono, Sour_Gummy, Nunito } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SkeletonThemeProvider } from '@/components/skeletons'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const sourGummy = Sour_Gummy({
  variable: '--font-sour-gummy',
  subsets: ['latin']
})

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): Promise<React.JSX.Element> {
  return (
    <html lang='fr'>
      <meta name='apple-mobile-web-app-title' content='Tamago' />
      <body
        className={`${nunito.variable} ${geistMono.variable} ${sourGummy.variable} antialiased`}
      >
        <SkeletonThemeProvider>
          {children}
          <ToastContainer
            position='top-right'
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
        </SkeletonThemeProvider>
      </body>
    </html>
  )
}
