import React, { useRef } from 'react'
import { useDrag } from 'react-use-gesture'
import { useSprings, animated } from 'react-spring'
import './styles.css'

const colors = ['lightcoral', 'cadetblue', 'mediumpurple', 'darkorange']

export default function TouchAction() {
  const [springs, set] = useSprings(colors.length * 4, i => ({
    x: 0,
    opacity: 1,
    moving: false,
    background: colors[i % 4],
  }))
  const bind = useDrag(
    ({
      event,
      down,
      movement: [x, y],
      vxvy: [vx, vy],
      tap,
      last,
      args: [index],
      elapsedTime,
    }) => {
      // console.log({ tap, elapsedTime, vx, vy })
      tap &&
        console.log(event.timeStamp, event.type, { tap, elapsedTime, vx, vy })
      set(i => {
        if (i === index)
          return { x: down ? x : 0, moving: down, immediate: down }
        else return { opacity: down ? 0.6 : 1 }
      })
    },
    { filterTaps: true }
  )

  return (
    <div className="touch-action">
      {springs.map(({ moving, ...style }, i) => (
        <animated.div
          key={i}
          className="drag"
          {...bind(i)}
          style={{ ...style, touchAction: 'pan-y' }}>
          {moving.to(m => (m ? 'body scroll is frozen' : '← Drag me →'))}
        </animated.div>
      ))}
    </div>
  )
}
