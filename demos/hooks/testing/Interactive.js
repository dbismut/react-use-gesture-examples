import React from 'react'
import { Common, createHandlers } from './Common'
import { useGesture } from 'react-use-gesture'

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}

const Interactive = ({
  bindArgs = [],
  gestures,
  canceled,
  memoArg,
  config,
}) => {
  const [state, set] = React.useState({})
  const [[startFired, endFired], setStartEnd] = React.useState([0, 0])

  const handlers = React.useMemo(
    () =>
      createHandlers({
        gestures,
        memoArg,
        set,
        setStartEnd,
        canceled,
      }),
    [canceled, memoArg]
  )

  const bind = useGesture(handlers, config)
  const testKey = gestures.join('').toLowerCase()

  return (
    <Common
      {...bind(...bindArgs)}
      state={state}
      testKey={testKey}
      startFired={startFired}
      endFired={endFired}
    />
  )
}

export default Interactive
