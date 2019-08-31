import randomcolor from 'randomcolor'
import { sum, mean, max } from 'lodash-es'

export const color = flag =>
  randomcolor({
    luminosity: flag ? 'bright' : 'dark',
    format: 'rgba',
    opacity: 0.8,
  })

export const initialConfig = {
  method: 'euler',
  dt: 100,
  tension: 120,
  friction: 12,
  mass: 1,
}

export const springConfigString = ({ tension, friction, mass }) =>
  `tension: ${tension}, friction: ${friction}, mass: ${mass}`

export const getLabelFromConfig = ({ method, dt }) =>
  `${method + (method === 'euler' ? ` (${dt}${dt > 20 ? '/ω' : 'ms'})` : '')}`

export const getPerf = (label, data) => {
  return {
    label,
    sum1000: sum(data.slice(0, 1000)),
    mean: mean(data),
    max: max(data),
    cycles: data.length,
  }
}
