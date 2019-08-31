import randomcolor from 'randomcolor'

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
