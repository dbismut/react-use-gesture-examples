import randomcolor from 'randomcolor'
import { sum, mean, max } from 'lodash-es'

const colors = {}

const stepMethods = ['euler', 'rk4', 'verlet']

export const methodHasSteps = m => stepMethods.indexOf(m) > -1

export const color = label => {
  colors[label] = colors[label]
    ? colors[label]
    : randomcolor({ luminosity: 'dark' })

  return colors[label]
}

export const initialConfig = {
  method: 'euler',
  step: 50,
  tension: 120,
  friction: 12,
  mass: 1,
  limitCycles: false,
  clamp: -1,
  velocity: 0,
}

const getOmega = ({ tension, mass }) => Math.sqrt(tension / mass)

export const springConfigString = ({
  tension,
  friction,
  mass,
  clamp,
  velocity,
}) =>
  `tension: ${tension}, friction: ${friction}, mass: ${mass}, velocity: ${velocity}, clamp: ${
    clamp === -1 ? 'no clamp' : clamp
  } (ω=${getOmega({
    tension,
    mass,
  }).toFixed(2)})`

export const getLabelFromConfig = ({ method, step, tension, mass }) =>
  `${method +
    (methodHasSteps(method)
      ? ` (${
          step > 20
            ? `${step / 1000}/ω - ${~~(step / getOmega({ tension, mass }))}ms`
            : `${step}ms`
        })`
      : '')}`

export const getPerf = (label, data) => {
  return {
    label,
    sum: sum(data.slice(0, 30)),
    mean: mean(data),
    max: max(data),
    cycles: data.length,
  }
}
