import React from 'react'
import { useSpring, animated } from 'react-spring'
import { useDrag, useGesture } from 'react-use-gesture'
import { toast } from 'react-toastify'

import GUI, { initialConfig } from './GUI'

import 'react-toastify/dist/ReactToastify.css'
import './styles.css'

toast.configure({
  position: 'bottom-right',
  pauseOnHover: false,
  draggable: false,
})

const testGestureHook = false

const useHook = (fn, config) => {
  if (testGestureHook) {
    return useGesture({ onDrag: fn }, config)
  }
  const { drag, ...rest } = config
  return useDrag(fn, { ...rest, ...drag })
}

export default function V7() {
  const domTarget = React.useRef(null)
  const [config, setConfig] = React.useState(initialConfig)
  const [props, set] = useSpring(() => ({ x: 0, y: 0, scale: 1 }))

  const [f, setF] = React.useState(0)

  const {
    gesture,
    threshold,
    swipeDist,
    swipeVel,
    bounds,
    activateBounds,
    rubberband,
    ...rest
  } = config

  const bind = useHook(
    ({
      delta,
      dragging,
      first,
      last,
      tap,
      currentTarget,
      swipe: [swipeX, swipeY],
      down,
      elapsedTime,
      movement: [mx, my],
      offset: [x, y],
      vxvy: [vx, vy],
    }) => {
      if (tap) toast('Click!')
      if (swipeX) toast(`Swipe ${swipeX > 0 ? 'Right' : 'Left'}`)
      if (swipeY) toast(`Swipe ${swipeY > 0 ? 'Bottom' : 'Top'}`)
      if (first) setF(a => ++a)

      if (gesture === 'movement')
        set({ x: down ? mx : 0, y: down ? my : 0, scale: down ? 1.2 : 1 })
      else set({ x, y, scale: down ? 1.2 : 1, immediate: down })
    },
    {
      domTarget,
      drag: {
        // initial: () => [props.x.get(), props.y.get()],
        swipeVelocity: [swipeVel, swipeVel],
        swipeDistance: [swipeDist, swipeDist],
        // // threshold: threshold < 0 ? undefined : [threshold, threshold],
        bounds: activateBounds ? bounds : undefined,
        rubberband: activateBounds ? rubberband : 0.15,
        // threshold: 100,
        ...rest,
      },
    }
  )

  React.useEffect(bind, [bind])

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      <GUI data={config} onUpdate={setConfig} />

      <div className="v7 flex-content">
        <div style={{ width: 80 + threshold, height: 80 + threshold }}>
          <animated.div
            ref={domTarget}
            // {...bind()}
            className="drag"
            style={props}
          />
        </div>
      </div>
    </>
  )
}
