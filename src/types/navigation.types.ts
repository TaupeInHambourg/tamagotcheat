/**
 * Types pour le système de navigation
 * Interface Segregation Principle: Small, focused interfaces
 */

/**
 * Item de navigation simple avec href et label
 */
export interface NavigationItem {
  href: string
  label: string
  icon: string
}

/**
 * Item de navigation avec action personnalisée (ex: logout)
 */
export interface NavigationItemWithAction extends NavigationItem {
  action: 'logout' | 'custom'
  color?: string
}

/**
 * Type union pour tous les types d'items de navigation
 */
export type NavItem = NavigationItem | NavigationItemWithAction

/**
 * Type guard pour vérifier si un item a une action
 */
export function hasAction (item: NavItem): item is NavigationItemWithAction {
  return 'action' in item
}
