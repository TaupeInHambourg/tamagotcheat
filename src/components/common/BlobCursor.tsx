// @ts-nocheck
'use client'

import { useTrail, animated } from '@react-spring/web'
import { useEffect } from 'react'

import './BlobCursor.css'

const fast = { tension: 1200, friction: 40 }
const slow = { mass: 10, tension: 200, friction: 50 }
const trans = (x: number, y: number): string => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`

interface BlobCursorProps {
  blobType?: 'circle' | 'square'
  fillColor?: string
}

/**
 * BlobCursor - Interactive cursor effect with animated blobs
 *
 * Creates a dynamic bubble effect that follows the cursor movement
 * using react-spring animations.
 *
 * @param blobType - Shape of the blobs ('circle' or 'square')
 * @param fillColor - Color of the blobs (hex or CSS color)
 */
const BlobCursor = ({ blobType = 'circle', fillColor = 'linear-gradient(135deg, #ff8585 0%, #e89b7f 100%)' }: BlobCursorProps): React.ReactNode => {
  const [trail, api] = useTrail(3, (i) => ({
    xy: [0, 0],
    config: i === 0 ? fast : slow
  }))

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent): void => {
      const x = 'clientX' in e ? e.clientX : (e.touches?.[0]?.clientX ?? 0)
      const y = 'clientY' in e ? e.clientY : (e.touches?.[0]?.clientY ?? 0)
      api.start({ xy: [x, y] })
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [api])

  return (
    <>
      <svg style={{ position: 'fixed', width: 0, height: 0 }}>
        <filter id='blob'>
          <feGaussianBlur in='SourceGraphic' result='blur' stdDeviation='15' />
          <feColorMatrix
            in='blur'
            type='matrix'
            values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7'
          />
        </filter>
      </svg>
      <div className='blob-cursor-main'>
        {trail.map((props, index) => (
          <animated.div
            key={index}
            style={{
              transform: props.xy.to(trans),
              borderRadius: blobType === 'circle' ? '50%' : '0%',
              /* Force exact color using hex; use background to allow gradients if provided */
              background: fillColor.startsWith('linear-gradient') ? fillColor : fillColor
            }}
          />
        ))}
      </div>
    </>
  )
}

export default BlobCursor
