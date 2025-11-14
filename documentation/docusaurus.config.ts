import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
  title: 'Tamagotcheat Documentation',
  tagline: 'Technical documentation for the Tamagotcheat project',
  favicon: 'img/favicon.ico',

  url: 'https://your-domain.com',
  baseUrl: '/', // Base URL for the site

  organizationName: 'TaupeInHambourg',
  projectName: 'tamagotcheat',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/TaupeInHambourg/tamagotcheat/tree/main/documentation/'
        },
        blog: {
          showReadingTime: true,
          routeBasePath: 'blog'
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],

  themeConfig: {
    navbar: {
      title: 'Tamagotcheat',
      logo: {
        alt: 'Tamagotcheat Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation'
        },
        {
          href: 'https://github.com/TaupeInHambourg/tamagotcheat',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/intro'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tamagotcheat.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
}

export default config
