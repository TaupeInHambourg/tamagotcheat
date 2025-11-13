/**
 * SkeletonThemeProvider Component
 *
 * Wrapper component that provides consistent skeleton styling across the app.
 * Uses project's autumn color palette for skeleton animations.
 *
 * Design Principles:
 * - Single Responsibility: Only handles skeleton theme configuration
 * - Open/Closed: Can be extended with additional props without modification
 * - Dependency Inversion: Depends on react-loading-skeleton abstraction
 *
 * @component
 */

'use client'

import type { ReactNode } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface SkeletonThemeProviderProps {
  children: ReactNode
}

/**
 * Provides themed skeleton loading states using autumn color palette
 *
 * Colors match the project's TailwindCSS autumn theme:
 * - Base color: autumn-cream (#FAF3E0)
 * - Highlight color: autumn-peach (#FFE5D9)
 */
export default function SkeletonThemeProvider ({
  children
}: SkeletonThemeProviderProps): ReactNode {
  return (
    <SkeletonTheme
      baseColor='#FAF3E0'
      highlightColor='#FFE5D9'
      borderRadius='0.75rem'
      duration={1.5}
    >
      {children}
    </SkeletonTheme>
  )
}
