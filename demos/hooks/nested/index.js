import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import './styles.css'

export default function Simple() {
  const domTarget = React.useRef(null)
  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0, scale: 1 }))
  const bind = useDrag(
    ({ event, down, movement: [x, y], timeStamp, memo = 0 }) => {
      console.log(event.type)
      set({ x, y, scale: down ? 1.2 : 1, immediate: true })
      return timeStamp
    },
    { domTarget: undefined, initial: () => [x.get(), y.get()] }
  )

  // React.useEffect(bind, [bind])
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <div className="simple flex-content">
      <animated.div ref={domTarget} {...bind()} style={{ x, y }}>
        <div style={{ backgroundColor: 'purple', height: '100%' }} />
      </animated.div>
    </div>
  )
}
