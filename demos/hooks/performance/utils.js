import randomcolor from 'randomcolor'
import { sum, mean, max } from 'lodash-es'

const colors = {}

export const color = label => {
  colors[label] = colors[label]
    ? colors[label]
    : randomcolor({ luminosity: 'dark', format: 'rgba', opacity: 0.8 })

  return colors[label]
}

export const initialConfig = {
  method: 'euler',
  dt: 100,
  tension: 120,
  friction: 12,
  mass: 1,
}

const getOmega = ({ tension, mass }) => Math.sqrt(tension / mass)

export const springConfigString = ({ tension, friction, mass }) =>
  `tension: ${tension}, friction: ${friction}, mass: ${mass} (ω=${getOmega({
    tension,
    mass,
  }).toFixed(2)})`

export const getLabelFromConfig = ({ method, dt, tension, mass }) =>
  `${method +
    (method === 'euler'
      ? ` (${dt}${
          dt > 20 ? `/ω - ${~~(dt / getOmega({ tension, mass }))}ms` : 'ms'
        })`
      : '')}`

export const getPerf = (label, data) => {
  return {
    label,
    sum1000: sum(data.slice(0, 1000)),
    mean: mean(data),
    max: max(data),
    cycles: data.length,
  }
}
