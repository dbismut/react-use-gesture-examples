import React from 'react'

export const createHandlers = ({
  gestures,
  memoArg,
  canceled,
  set,
  setStartEnd,
}) => {
  return gestures.reduce((acc, g) => {
    const gesture = {
      [`on${g}`]: ({
        event,
        cancel,
        currentTarget,
        memo = memoArg,
        ...rest
      }) => {
        set({ ...rest, memo })
        if (canceled && cancel) {
          cancel()
        }
        return memo
      },
    }
    if (g !== 'Hover') {
      gesture[`on${g}Start`] = () => {
        setStartEnd(([startFired, endFired]) => [startFired + 1, endFired])
      }
      gesture[`on${g}End`] = () => {
        setStartEnd(([, endFired]) => [0, endFired + 1])
      }
    }
    return {
      ...acc,
      ...gesture,
    }
  }, {})
}

export const Common = React.forwardRef(
  (
    { testKey, state, startFired = 0, endFired = 0, children, ...listeners },
    ref
  ) => {
    return (
      <div
        ref={ref}
        {...listeners}
        data-testid={`${testKey}-el`}
        style={{ height: 400, width: 400 }}>
        <div data-testid={`${testKey}-start`}>
          Start fired:{' '}
          {startFired === 0
            ? 'not fired'
            : startFired > 1
            ? 'fired too much'
            : 'fired'}
        </div>
        <div data-testid={`${testKey}-end`}>
          End fired:{' '}
          {endFired === 0
            ? 'not fired'
            : endFired > 1
            ? 'fired too much'
            : 'fired'}
        </div>
        {Object.entries(state).map(([k, v]) => (
          <div key={k} data-testid={`${testKey}-${k}`}>
            {k}: {String(v)}
          </div>
        ))}
        {children}
      </div>
    )
  }
)
