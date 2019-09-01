import React from 'react'
import { useSpring, animated } from 'react-spring'
import Gui from './Gui'
import {
  initialConfig,
  color,
  getLabelFromConfig,
  springConfigString,
  getPerf,
} from './utils'
import Chart from './Chart'
import 'react-dat-gui/build/react-dat-gui.css'
import './styles.css'

export default function Performance() {
  const [data, setData] = React.useState([])
  const [config, setConfig] = React.useState(initialConfig)

  const { method } = config

  const [{ x }, set] = useSpring(() => ({ x: 0 }))

  const runSpring = () => {
    const bufferData = []
    const bufferPerf = []
    set({
      from: { x: 0 },
      reset: true,
      x: 500,
      config,
      onFrame: () => {
        bufferData.push({ x: x.elapsedTime, y: x.getValue() })
        bufferPerf.push(x.performance)
      },
      onRest: () => {
        const title = springConfigString(config)
        const label = getLabelFromConfig(config)
        const c = method === 'euler' ? color(label) : 'blue'
        const datasets = {
          label,
          backgroundColor: c,
          borderColor: c,
          pointRadius: 2,
          data: bufferData,
        }

        const perf = getPerf(label, bufferPerf)

        setData(d => {
          if (d.length > 0 && d[d.length - 1].title === title) {
            d[d.length - 1].datasets.push(datasets)
            d[d.length - 1].perfs.push(perf)
          } else {
            d.push({ title, datasets: [datasets], perfs: [perf] })
          }
          return [...d]
        })
        setTimeout(
          () => set({ x: 0, immediate: true, onFrame: null, onRest: null }),
          1000
        )
      },
    })
  }

  return (
    <div className="performance">
      <Gui config={config} onUpdate={setConfig} />
      <div className="animation">
        <animated.div onClick={runSpring} style={{ x }} />
      </div>
      <div className="chart">
        {data.map(({ datasets, perfs, title }, i) => (
          <Chart key={i} title={title} datasets={datasets} perfs={perfs} />
        ))}
      </div>
    </div>
  )
}
