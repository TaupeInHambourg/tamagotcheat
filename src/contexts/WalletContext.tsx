/**
 * Wallet Context
 *
 * Global state management for user's Koins and Gifts balance.
 * Provides real-time updates across the entire application.
 *
 * Architecture Principles:
 * - Single Responsibility: Manages only wallet state
 * - Dependency Inversion: Components depend on this abstraction
 * - Clean Architecture: Application state layer
 *
 * Features:
 * - Automatic balance updates on mount
 * - Manual refresh capability
 * - Optimistic UI updates
 * - Only re-renders when values actually change
 *
 * @module contexts
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getKoinsBalance } from '@/actions/wallet.actions'
import { getUserGiftsBalance } from '@/actions/quests.actions'

/**
 * Wallet state structure
 */
interface WalletState {
  koins: number
  gifts: number
  isLoading: boolean
  lastUpdated: Date | null
}

/**
 * Wallet context value with state and actions
 */
interface WalletContextValue extends WalletState {
  /** Refresh balances from server */
  refreshBalances: () => Promise<void>
  /** Update koins optimistically (will be validated on next refresh) */
  updateKoins: (newAmount: number) => void
  /** Update gifts optimistically (will be validated on next refresh) */
  updateGifts: (newAmount: number) => void
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

/**
 * Wallet Provider Component
 *
 * Wraps the app to provide wallet state to all components.
 * Should be placed high in the component tree (in layout).
 */
export function WalletProvider ({
  children,
  userId
}: {
  children: ReactNode
  userId: string
}): ReactNode {
  const [state, setState] = useState<WalletState>({
    koins: 0,
    gifts: 0,
    isLoading: true,
    lastUpdated: null
  })

  /**
   * Fetch balances from server
   * Only updates state if values have changed
   */
  const refreshBalances = useCallback(async () => {
    try {
      const [koinsBalance, giftsBalance] = await Promise.all([
        getKoinsBalance(userId),
        getUserGiftsBalance()
      ])

      setState((prev) => {
        // Only update if values have changed
        if (prev.koins === koinsBalance && prev.gifts === giftsBalance && !prev.isLoading) {
          return prev
        }

        return {
          koins: koinsBalance,
          gifts: giftsBalance,
          isLoading: false,
          lastUpdated: new Date()
        }
      })
    } catch (error) {
      console.error('[WalletContext] Failed to fetch balances:', error)
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [userId])

  /**
   * Optimistically update koins
   * Useful for immediate UI feedback before server confirmation
   */
  const updateKoins = useCallback((newAmount: number) => {
    setState((prev) => ({
      ...prev,
      koins: newAmount,
      lastUpdated: new Date()
    }))
  }, [])

  /**
   * Optimistically update gifts
   */
  const updateGifts = useCallback((newAmount: number) => {
    setState((prev) => ({
      ...prev,
      gifts: newAmount,
      lastUpdated: new Date()
    }))
  }, [])

  // Initial load
  useEffect(() => {
    void refreshBalances()
  }, [refreshBalances])

  // Periodic refresh every 30 seconds (less aggressive than before)
  useEffect(() => {
    const interval = setInterval(() => {
      void refreshBalances()
    }, 30000)

    return () => { clearInterval(interval) }
  }, [refreshBalances])

  const value: WalletContextValue = {
    ...state,
    refreshBalances,
    updateKoins,
    updateGifts
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

/**
 * Hook to use wallet context
 *
 * @throws Error if used outside WalletProvider
 * @returns Wallet state and actions
 *
 * @example
 * ```tsx
 * const { koins, gifts, refreshBalances } = useWallet()
 * ```
 */
export function useWallet (): WalletContextValue {
  const context = useContext(WalletContext)

  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }

  return context
}
