import React from 'react'
import { useSpring, animated } from 'react-spring'
import { Scatter } from 'react-chartjs-2'
import Gui from './Gui'
import { initialConfig, color } from './utils'

import 'react-dat-gui/build/react-dat-gui.css'
import './styles.css'

export default function Performance() {
  const [datasets, setDatasets] = React.useState([])
  const [config, setConfig] = React.useState(initialConfig)

  const { method, tension, mass, friction } = config

  const bufferData = React.useRef([])
  const [{ y }, set] = useSpring(() => ({
    y: -250,
  }))

  const runSpring = () => {
    bufferData.current = []
    set({
      from: { y: -250 },
      reset: true,
      y: 250,
      config,
      onFrame: () =>
        bufferData.current.push({ x: y.elapsedTime, y: y.getValue() }),
      onRest: () => {
        console.log(y.performance)
        const m =
          method +
          (method === 'euler'
            ? ` (${config.dt}${config.dt > 20 ? '/ω' : 'ms'})`
            : '')
        const c = color(method === 'euler')
        setDatasets(d => {
          return [
            ...d,
            {
              label: `${m} [${[tension, friction, mass].join(',')}]`,
              backgroundColor: c,
              borderColor: c,
              pointRadius: 2,
              pointStyle: 'cross',
              data: [...bufferData.current],
            },
          ]
        })
        setTimeout(
          () => set({ y: -250, immediate: true, onFrame: null, onRest: null }),
          1000
        )
      },
    })
  }

  return (
    <div className="performance">
      <div className="animation">
        <animated.div onClick={runSpring} style={{ y }} />
      </div>
      <div className="chart">
        <Gui config={config} onUpdate={setConfig} />
        <Scatter
          data={{ datasets }}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    suggestedMin: -300,
                    suggestedMax: 300,
                  },
                },
              ],
              xAxes: [
                {
                  ticks: {
                    suggestedMin: 0,
                    suggestedMax: 1000,
                  },
                },
              ],
            },
          }}
        />
      </div>
    </div>
  )
}
