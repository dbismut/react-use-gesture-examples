import React from 'react'
import { useTrail, useSprings, animated, config } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import './styles.css'

const c = { ...config.stiff, step: 1, method: 'analytical' }

export default function Hundreds() {
  const [springs, set] = useTrail(20, () => ({ x: 0, y: 0, config: c }))
  // const [springs, set] = useSprings(50, i => ({ x: 0, y: 0, config: c }))

  // const bind = useDrag(({ offset: [x, y] }) => {
  //   set(i => ({
  //     x: i === 0 ? x : springs[i - 1].x.getValue(),
  //     y: i === 0 ? y : springs[i - 1].y.getValue(),
  //   }))
  // })

  const bind = useDrag(({ offset: [x, y] }) => {
    set({ x, y })
  })

  return (
    <div className="hundreds">
      {springs.map((props, index) =>
        index === 0 ? (
          <animated.div {...bind()} key={index} style={props} />
        ) : (
          <animated.div key={index} style={props} />
        )
      )}
    </div>
  )
}
