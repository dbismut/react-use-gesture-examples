import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useWheel } from 'react-use-gesture'
import { clamp } from 'lodash'
import './styles.css'

export default function Wheel() {
  const [{ wheel, zoom }, set] = useSpring(() => ({
    wheel: 0,
    zoom: 0,
  }))

  const domTarget = React.useRef(null)

  const bind = useWheel(
    ({ first, last, distance, offset: [ox, oy] }) => {
      set({ wheel: ox, immediate: !last })
    },
    {
      domTarget,
      event: { passive: false },
      axis: 'x',
    }
  )

  React.useEffect(bind, [bind])

  return (
    <div ref={domTarget} className="wheel">
      <animated.div>{wheel.to(v => v.toFixed(2))}</animated.div>
      <animated.div>{zoom}</animated.div>
    </div>
  )
}
