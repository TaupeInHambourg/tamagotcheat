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
        'architecture/overview',
        'architecture/solid-principles',
        'architecture/lazy-state-system',
        'architecture/database-layer'
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
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/overview',
        'api/monsters',
        'api/use-monster-polling',
        'api/monster-state-decay'
      ]
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/setup',
        'guides/migration-to-lazy-state',
        'guides/toast-notifications'
      ]
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        'features/dynamic-monster-assets'
      ]
    }
  ]
}

export default sidebars
