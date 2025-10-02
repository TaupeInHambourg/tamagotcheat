import Link from 'next/link'

import type { ReactNode } from 'react'

export default function Footer (): ReactNode {
  return (
    <footer className='bg-pink-flare-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-pink-flare-900'>TamagoTcheat</h3>
            <p className='text-pink-flare-600 text-sm'>
              Élevez votre propre monstre virtuel et créez des liens uniques dans notre univers interactif.
            </p>
          </div>

          {/* Legal Links */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-pink-flare-900'>Légal</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/privacy' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href='/cookies' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-pink-flare-900'>Ressources</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/blog' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='/faq' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='/support' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-pink-flare-900'>Suivez-nous</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='https://twitter.com' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  Twitter
                </Link>
              </li>
              <li>
                <Link href='https://instagram.com' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  Instagram
                </Link>
              </li>
              <li>
                <Link href='https://discord.com' className='text-pink-flare-600 hover:text-pink-flare-700 text-sm'>
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-pink-flare-200'>
          <p className='text-center text-pink-flare-600 text-sm'>
            © {new Date().getFullYear()} TamagoTcheat. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
