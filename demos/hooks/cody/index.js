// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import { render } from 'react-dom'
import React, { useRef, useState } from 'react'
import { useGesture } from 'react-use-gesture'
import { useSpring, animated } from 'react-spring'
import './styles.css'

const DOUBLE_CLICK_TIME_THRESHOLD = 250

export default function App() {
  const [editMode, setEditMode] = useState(false)
  console.log('App editMode = ', editMode)
  return (
    <div>
      <button
        style={{ marginBottom: 120, background: editMode ? 'green' : 'red' }}
        onClick={() => setEditMode(oldState => !oldState)}>
        Edit Mode
      </button>
      <DraggableItem isEditMode={editMode} position={[0, 0]} />
    </div>
  )
}

function DraggableItem({ isEditMode, position: [positionX, positionY] }) {
  console.log('DraggableItem isEditMode = ', isEditMode)
  const [active, setActive] = useState(false)
  const [spring, setSpring] = useSpring(() => ({ x: positionX, y: positionY }))
  const isDragging = useRef(false)
  const isDoubleClicked = useRef(false)
  const previousClickTimestamp = useRef(performance.now())
  const gestureBinds = useGesture({
    onDrag: state => {
      console.log('onDrag isEditMode = ', isEditMode)

      if (!state) return
      const {
        down,
        movement: [movementX, movementY],
        first,
        last,
      } = state
      if (first) {
        isDragging.current = true
      } else if (last) {
        requestAnimationFrame(() => void (isDragging.current = false))
      }

      if (!active && !isEditMode) {
        return
      }

      setSpring({
        x: down ? movementX : 0,
        y: down ? movementY : 0,
      })
    },
    onClick: event => {
      console.log('onClick isEditMode = ', isEditMode)

      if (!event) return

      if (!isEditMode) {
        return
      }

      event.stopPropagation()
      const now = performance.now()
      const clickDeltaTime = now - previousClickTimestamp.current

      if (
        isDoubleClicked.current ||
        clickDeltaTime >= DOUBLE_CLICK_TIME_THRESHOLD
      ) {
        isDoubleClicked.current = false
        setActive(false)
      } else {
        isDoubleClicked.current = true
        setActive(true)
      }

      previousClickTimestamp.current = now
    },
  })
  return (
    <animated.div
      {...gestureBinds()}
      style={{
        ...spring,
        position: 'absolute',
        background: active ? 'red' : 'transparent',
      }}>
      Drag Me
    </animated.div>
  )
}
