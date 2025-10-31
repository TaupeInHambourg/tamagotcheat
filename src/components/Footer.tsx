import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Footer - Pied de page
 *
 * Responsabilité unique : Afficher les informations et liens du footer
 */
export default function Footer (): ReactNode {
  return (
    <footer className='bg-gradient-to-br from-chestnut-cream to-autumn-peach/30 border-t-2 border-autumn-peach'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12'>
          {/* Company Info */}
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-lg sm:text-xl font-bold text-chestnut-deep flex items-center gap-2'>
              <span>🍂</span>
              <span>TamagoTcheat</span>
            </h3>
            <p className='text-chestnut-medium leading-relaxed text-sm'>
              Élevez votre propre monstre virtuel et créez des liens uniques dans notre univers interactif.
            </p>
          </div>

          {/* Legal Links */}
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-base sm:text-lg font-semibold text-chestnut-deep'>Légal</h3>
            <ul className='space-y-2 sm:space-y-3'>
              <li>
                <Link href='/privacy' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200'>
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href='/terms' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200'>
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href='/cookies' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200'>
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-base sm:text-lg font-semibold text-chestnut-deep'>Ressources</h3>
            <ul className='space-y-2 sm:space-y-3'>
              <li>
                <Link href='/blog' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href='/faq' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='/support' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200'>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-base sm:text-lg font-semibold text-chestnut-deep'>Suivez-nous</h3>
            <ul className='space-y-2 sm:space-y-3'>
              <li>
                <Link href='https://twitter.com' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200 flex items-center gap-2'>
                  <span>🐦</span>
                  <span>Twitter</span>
                </Link>
              </li>
              <li>
                <Link href='https://instagram.com' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200 flex items-center gap-2'>
                  <span>📸</span>
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link href='https://discord.com' className='text-chestnut-medium hover:text-autumn-cinnamon text-sm transition-colors duration-200 flex items-center gap-2'>
                  <span>💬</span>
                  <span>Discord</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t-2 border-autumn-peach/50'>
          <p className='text-center text-chestnut-medium leading-relaxed text-sm flex flex-wrap items-center justify-center gap-2'>
            <span>© {new Date().getFullYear()} TamagoTcheat.</span>
            <span>Tous droits réservés</span>
            <span>✨</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
