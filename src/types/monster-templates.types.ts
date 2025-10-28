export type MonsterColor = '#FF69B4' | '#87CEEB' | '#98FB98' | '#FFD700'

export interface MonsterTemplate {
  id: string
  name: string
  folderPath: string
  draw: string
  colorRange: string[]
  defaultColor: MonsterColor
}

export const monsterTemplates: Record<string, MonsterTemplate> = {
  'chat-cosmique': {
    id: 'chat-cosmique',
    name: 'Chat Cosmique',
    folderPath: 'chat-cosmique',
    draw: '/assets/tamagocheats/chat-cosmique/happy.svg',
    colorRange: ['#FF69B4', '#FF1493', '#C71585'],
    defaultColor: '#FF69B4'
  },
  'dino-nuage': {
    id: 'dino-nuage',
    name: 'Dino Nuage',
    folderPath: 'dino-nuage',
    draw: '/assets/tamagocheats/dino-nuage/happy.svg',
    colorRange: ['#87CEEB', '#00BFFF', '#1E90FF'],
    defaultColor: '#87CEEB'
  },
  'fairy-monster': {
    id: 'fairy-monster',
    name: 'Monstre Féérique',
    folderPath: 'fairy-monster',
    draw: '/assets/tamagocheats/fairy-monster/happy.svg',
    colorRange: ['#98FB98', '#90EE90', '#32CD32'],
    defaultColor: '#98FB98'
  },
  'grenouille-etoilee': {
    id: 'grenouille-etoilee',
    name: 'Grenouille Étoilée',
    folderPath: 'grenouille-etoilee',
    draw: '/assets/tamagocheats/grenouille-etoilee/happy.svg',
    colorRange: ['#FFD700', '#FFA500', '#FF8C00'],
    defaultColor: '#FFD700'
  }
}
