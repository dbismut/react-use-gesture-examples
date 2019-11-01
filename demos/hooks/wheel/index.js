import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { clamp } from 'lodash'
import './styles.css'

export default function Wheel() {
  const [{ wheel, zoom }, set] = useSpring(() => ({
    wheel: 0,
    zoom: 0,
  }))

  const domTarget = React.useRef(null)

  const bind = useGesture(
    {
      onWheel: ({ offset: [, oy] }) => {
        set({ wheel: oy, immediate: true })
      },
      onPinch: ({ offset: [z] }) => {
        set({ zoom: z, immediate: true })
      },
    },
    { domTarget, event: { passive: false } }
  )

  React.useEffect(bind, [bind])

  return (
    <div ref={domTarget} className="wheel">
      <animated.div>{wheel}</animated.div>
      <animated.div>{zoom}</animated.div>
    </div>
  )
}
