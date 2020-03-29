import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useScroll } from 'react-use-gesture'

export default function Scroll() {
  const [{ scaleX }, set] = useSpring(() => ({ scaleX: 0 }))
  const bind = useScroll(
    ({ xy: [, y] }) => {
      console.log(y)
      set({ scaleX: y / window.innerHeight })
    },
    { domTarget: window }
  )

  React.useEffect(bind, [bind])

  return <animated.div style={{ scaleX }} />
}
