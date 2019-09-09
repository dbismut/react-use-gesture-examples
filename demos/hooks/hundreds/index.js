import React from 'react'
import { useSprings, animated, config } from 'react-spring'
import './styles.css'

const c = { ...config.wobbly, method: 'simple' }

export default function Hundreds() {
  const [springs, set] = useSprings(1000, i => ({ x: 0, y: i * 4 }))
  const toggle = React.useRef(false)

  const run = () => {
    set(i => ({ x: i * (toggle.current ? 100 : 10), config: c }))
    toggle.current = !toggle.current
  }

  return (
    <>
      <button onClick={run}>Run</button>
      <div className="hundreds">
        {springs.map((props, index) => (
          <animated.div key={index} style={props} />
        ))}
      </div>
    </>
  )
}
