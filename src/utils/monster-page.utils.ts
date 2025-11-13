/**
 * Monster Page Utilities
 *
 * Pure functions for monster page display logic.
 * Following Single Responsibility Principle - each function has one clear purpose.
 *
 * @module utils/monster-page
 */

import type { Monster } from '@/types/monster.types'

/**
 * State styling mappings
 * Maps monster states to Tailwind CSS classes
 */
const STATE_STYLES: Record<string, string> = {
  happy: 'bg-green-100 text-green-800',
  angry: 'bg-red-100 text-red-800',
  sleepy: 'bg-blue-100 text-blue-800',
  hungry: 'bg-yellow-100 text-yellow-800',
  sad: 'bg-gray-100 text-gray-800'
} as const

/**
 * Mood emoji mappings
 */
const MOOD_EMOJIS: Record<string, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😤',
  hungry: '😋',
  sleepy: '😴'
} as const

/**
 * French state labels
 */
const STATE_LABELS_FR: Record<string, string> = {
  happy: 'Heureux',
  sad: 'Triste',
  angry: 'En colère',
  hungry: 'Affamé',
  sleepy: 'Endormi'
} as const

/**
 * Get Tailwind CSS classes for a monster state
 *
 * @param state - The monster's current state
 * @returns CSS class string
 */
export function getStateStyle (state: string): string {
  return STATE_STYLES[state] ?? 'bg-gray-100 text-gray-800'
}

/**
 * Get emoji representation of a monster's mood
 *
 * @param state - The monster's current state
 * @returns Emoji string
 */
export function getMoodEmoji (state: string): string {
  return MOOD_EMOJIS[state] ?? '😶'
}

/**
 * Get French label for a monster's state
 *
 * @param state - The monster's current state
 * @returns Localized label
 */
export function getStateLabelFr (state: string): string {
  return STATE_LABELS_FR[state] ?? state.charAt(0).toUpperCase() + state.slice(1)
}

/**
 * Format a date string to French locale
 *
 * @param date - ISO date string or undefined
 * @returns Formatted date string or fallback message
 */
export function formatDate (date: string | undefined): string {
  if (typeof date !== 'string' || date.trim() === '') {
    return 'Date inconnue'
  }

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date inconnue'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(parsedDate)
}

/**
 * Safely extracts the monster ID from either id or _id field
 *
 * The repository normalizes _id to id, but we keep _id as fallback
 * for backward compatibility.
 *
 * @param monster - Monster object
 * @returns The monster ID as string
 */
export function getMonsterId (monster: Monster): string {
  return monster.id ?? monster._id ?? ''
}

/**
 * Toast configuration for success notifications
 */
export const TOAST_SUCCESS_CONFIG = {
  position: 'top-right' as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light' as const
}

/**
 * Toast configuration for info notifications
 */
export const TOAST_INFO_CONFIG = {
  position: 'top-right' as const,
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: 'light' as const
}

/**
 * Toast configuration for error notifications
 */
export const TOAST_ERROR_CONFIG = {
  position: 'top-right' as const,
  autoClose: 3000,
  theme: 'light' as const
}
