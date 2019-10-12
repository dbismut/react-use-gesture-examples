import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useWheel } from 'react-use-gesture'
import { clamp } from 'lodash'
import './styles.css'

export default function Wheel() {
  const [{ clampY, localY }, set] = useSpring(() => ({ clampY: 0, offsetY: 0 }))

  const bind = useWheel(
    ({ offset: [, oy], movement: [, my], memo = clampY.getValue() }) => {
      set({ clampY: clamp(my + memo, -500, 500), offsetY: oy, immediate: true })
      return memo
    }
  )

  return (
    <div className="wheel" {...bind()}>
      <animated.div>{clampY}</animated.div>
      <animated.div>{localY}</animated.div>
    </div>
  )
}
