import React, { useRef } from 'react'
import { useTrail, animated as anim } from 'react-spring'
import './styles.css'

const fast = { tension: 1200, friction: 40 }
const slow = { mass: 10, tension: 200, friction: 50 }

export default function Goo() {
  const ref = useRef(null)
  const [trail, set] = useTrail(3, () => ({
    x: 0,
    y: 0,
    config: i => (i === 0 ? fast : slow),
  }))

  return (
    <div
      ref={ref}
      className="goo-main"
      onMouseMove={e => {
        const rect = ref.current.getBoundingClientRect()
        set({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7"
          />
        </filter>
      </svg>
      <div className="hooks-main">
        <div className="hooks-filter">
          {trail.map(({ x, y }, index) => (
            <anim.div
              key={index}
              style={{ x, y, transform: 'translate3d(-50%,-50%,0)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
