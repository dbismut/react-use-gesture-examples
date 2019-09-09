import React from 'react'
import DatGui, {
  DatFolder,
  DatNumber,
  DatSelect,
  DatBoolean,
} from 'react-dat-gui'
import { methodHasSteps } from './utils'

export default function Gui({ config, onUpdate }) {
  const { method, step, tension, friction, mass, clamp } = config

  const configLabel = `Step Δt=${step > 20 ? `${step / 1000}/ω` : `${step}ms`}`

  const zeta = friction / (2 * Math.sqrt(tension * mass)) // damping ratio

  const springDamping =
    zeta < 1 ? 'under damped' : zeta > 1 ? 'over damped' : 'critically damped'

  return (
    <DatGui data={config} onUpdate={onUpdate} style={{ width: 350 }}>
      <DatFolder title="Method" closed={false}>
        <DatSelect
          path="method"
          label="Solution"
          options={['euler', 'rk4', 'analytical', 'simplified']}
        />
        {methodHasSteps(method) ? (
          <DatNumber
            path="step"
            label={configLabel}
            min={1}
            max={2000}
            step={1}
          />
        ) : (
          <i />
        )}
        <DatBoolean path="limitCycles" label="Limit Cycles" />
      </DatFolder>
      <DatFolder title={`Spring config (${springDamping})`} closed={false}>
        <DatNumber path="tension" label="Tension" min={0} max={200} step={10} />
        <DatNumber
          path="friction"
          label="Friction"
          min={0}
          max={200}
          step={1}
        />
        <DatNumber path="mass" label="Mass" min={1} max={10} step={1} />
        <DatNumber
          path="velocity"
          label="Velocity"
          min={-10}
          max={10}
          step={1}
        />
        <DatNumber
          path="clamp"
          label={`Clamp${clamp === -1 ? ' (no clamp)' : ''}`}
          min={-1}
          max={4}
          step={0.1}
        />
      </DatFolder>
    </DatGui>
  )
}
