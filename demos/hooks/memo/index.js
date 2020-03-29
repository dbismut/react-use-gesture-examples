import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

import './styles.css'

export default function Memo() {
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
  const bind = useDrag(
    ({ down, movement: [mx, my], offset: [x, y] }) => {
      set({
        x: down ? mx : 0,
        y: down ? my : 0,
        immediate: down,
        config: { duration: 3000 },
      })
    },
    { initial: () => [x.getValue(), y.getValue()] }
  )
  return (
    <div className="memo">
      <animated.div {...bind()} style={{ x, y }} />
    </div>
  )
}
