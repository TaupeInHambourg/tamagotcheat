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
        'api/monsters'
      ]
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/setup'
      ]
    }
  ]
}

export default sidebars
