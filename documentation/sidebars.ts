import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'architecture/clean-architecture',
        'architecture/overview',
        'architecture/solid-principles',
        'architecture/lazy-state-system',
        'architecture/database-layer'
      ]
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        'features/overview',
        'features/shop-system',
        'features/quest-system',
        'features/monster-interactions',
        'features/dynamic-monster-assets'
      ]
    },
    {
      type: 'category',
      label: 'Components',
      collapsed: false,
      items: [
        'components/overview',
        'components/button'
      ]
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/local-development',
        'guides/setup',
        'guides/toast-notifications'
      ]
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/overview',
        'api/monsters',
        'api/use-monster-polling',
        'api/monster-state-decay'
      ]
    }
  ]
}

export default sidebars
