/**
 * Landing Page
 *
 * Main entry point for the Tamagotcheat application.
 * Displays marketing content and directs users to create their first monster.
 *
 * Structure:
 * - Hero section with main CTA
 * - Features showcase
 * - Monster templates preview
 * - Available actions overview
 * - Newsletter signup
 *
 * SEO optimized with comprehensive metadata.
 *
 * @page
 */

import LandingHeader from '@/components/navigation/LandingHeader'
import Footer from '@/components/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import MonstersShowcase from '@/components/home/MonstersShowcase'
import ActionsSection from '@/components/home/ActionsSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import { Metadata } from 'next'

/**
 * Page metadata for SEO and social sharing
 */
export const metadata: Readonly<Metadata> = {
  title: 'Tamagotcheat - Adoptez votre compagnon virtuel unique',
  description: 'Créez, élevez et choyez votre petit monstre dans un univers magique et coloré. Une expérience attachante qui ravira petits et grands !',
  keywords: 'monstre virtuel, compagnon virtuel, jeu interactif, élever un monstre, créature magique, jeu pour enfants, jeu pour adultes, univers coloré, expérience de jeu, Tamagotcheat',
  openGraph: {
    title: 'Tamagotcheat - Adoptez votre compagnon virtuel unique',
    description: 'Créez, élevez et choyez votre petit monstre dans un univers magique et coloré. Une expérience attachante qui ravira petits et grands !',
    url: 'https://www.tamagotcheat.com',
    siteName: 'Tamagotcheat'
  },
  twitter: {
    title: 'Tamagotcheat - Adoptez votre compagnon virtuel unique',
    description: 'Créez, élevez et choyez votre petit monstre dans un univers magique et coloré. Une expérience attachante qui ravira petits et grands !'
  }
}

export default function Home (): React.ReactNode {
  return (
    <div className='bg-gradient-to-br from-autumn-cream via-autumn-peach/20 to-moss-light min-h-screen'>
      <LandingHeader />
      <main className='pt-20'>
        <HeroSection />
        <FeaturesSection />
        <MonstersShowcase />
        <ActionsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
