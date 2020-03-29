import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useHover, useGesture } from 'react-use-gesture'
import './styles.css'

export default function Hover() {
  const domTarget = React.useRef(null)
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0, scale: 1 }))
  // const bind = useHover(
  //   ({ active, hovering }) => {
  //     console.log({ active, hovering })
  //   },
  //   { domTarget, enabled: true }
  // )

  const bind = useGesture(
    {
      onHover: ({ active, hovering }) => {
        console.log({ active, hovering })
      },
      onMove: ({ moving, hovering }) => console.log({ moving, hovering }),
    },
    { domTarget, hover: { enabled: false } }
  )

  React.useEffect(bind, [bind])
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <div className="hover flex-content">
      <animated.div ref={domTarget} style={{ x, y }}>
        <div style={{ backgroundColor: 'purple', height: '100%' }} />
      </animated.div>
    </div>
  )
}
