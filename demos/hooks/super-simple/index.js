import React from 'react'
import { useSpring, animated, config } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import './styles.css'

export default function SuperSimple() {
  const [spring, set] = useSpring(() => ({ x: 0, y: 0 }))

  const bind = useDrag(({ down, movement: [dx, dy], vxvy }) => {
    set({
      x: down ? dx : 0,
      y: down ? dy : 0,
      config: down
        ? config.default
        : key => ({
            tension: 120,
            friction: 10,
            velocity: vxvy[key === 'x' ? 0 : 1],
          }),
    })
  })

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <div className="super-simple">
      <animated.div {...bind()} style={spring} />
    </div>
  )
}
