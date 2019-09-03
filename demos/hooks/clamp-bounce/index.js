import React from 'react'
import { useSpring, animated } from 'react-spring'
import './styles.css'

let t

export default function ClampBounce() {
  const [toggle, setToggle] = React.useState(false)
  const props = useSpring({
    // onStart: () => (t = performance.now()),
    // onRest: () => console.log(performance.now() - t),
    y: toggle ? 250 : -250,
    config: { tension: 120, friction: 12, clamp: 2 },
  })

  return (
    <div className="clamp-bounce">
      <animated.div onClick={() => setToggle(t => !t)} style={props} />
    </div>
  )
}
