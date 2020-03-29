import React from 'react'
import Interactive from './Interactive'

export default function Testing() {
  return (
    <>
      <Interactive
        gestures={['Drag']}
        config={{
          drag: { bounds: { top: -100, bottom: 200, left: -150, right: 250 } },
        }}
      />
    </>
  )
}
