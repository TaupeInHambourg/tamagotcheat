import Image from 'next/image'
import { Monster } from '@/types/monster.types'

export interface MonsterCardProps {
  monster: Monster
}

export default function MonsterCard ({ monster }: MonsterCardProps): React.ReactNode {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='relative w-full h-48'>
        <Image
          src={monster.draw}
          alt={monster.name}
          fill
          className='object-cover'
        />
      </div>
      <div className='p-4'>
        <h3 className='text-lg font-semibold text-pink-flare-900'>{monster.name}</h3>
        <p className='text-sm text-gray-600'>Niveau {monster.level}</p>
        <div className='mt-2'>
          <span className={`inline-block px-2 py-1 rounded-full text-xs
            ${monster.state === 'happy'
? 'bg-green-100 text-green-800'
              : monster.state === 'angry'
? 'bg-red-100 text-red-800'
              : monster.state === 'sleepy'
? 'bg-blue-100 text-blue-800'
              : monster.state === 'hungry'
? 'bg-yellow-100 text-yellow-800'
              : monster.state === 'sad'
? 'bg-gray-100 text-gray-800'
              : 'bg-gray-100 text-gray-800'
            }`}
          >
            {monster.state.charAt(0).toUpperCase() + monster.state.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
