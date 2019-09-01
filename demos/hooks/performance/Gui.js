import React from 'react'
import DatGui, { DatFolder, DatNumber, DatSelect } from 'react-dat-gui'

export default function Gui({ config, onUpdate }) {
  return (
    <DatGui data={config} onUpdate={onUpdate}>
      <DatFolder title="Method" closed={false}>
        <DatSelect
          path="method"
          label="Solution"
          options={['euler', 'verlet', 'analytical']}
        />
        {config.method !== 'analytical' ? (
          <DatNumber
            path="dt"
            label={`${config.method} Δt=${config.dt}${
              config.dt > 20 ? '/ω' : 'ms'
            }`}
            min={1}
            max={2000}
            step={1}
          />
        ) : (
          <i />
        )}
      </DatFolder>
      <DatNumber path="tension" label="Tension" min={0} max={200} step={10} />
      <DatNumber path="friction" label="Friction" min={1} max={200} step={1} />
      <DatNumber path="mass" label="Mass" min={1} max={10} step={1} />
    </DatGui>
  )
}
