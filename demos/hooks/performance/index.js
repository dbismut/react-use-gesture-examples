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
  const [ghosts, setGhosts] = React.useState([])

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
        const c = method !== 'analytical' ? color(label) : '#0011ff44'
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

  const onHover = React.useCallback(
    (index, points) => {
      const g = points.map(({ _options, _index, _datasetIndex }) => ({
        x: data[index].datasets[_datasetIndex].data[_index].y,
        color: _options.backgroundColor,
        index: _datasetIndex,
      }))
      setGhosts(g)
    },
    [data]
  )

  return (
    <div className="performance">
      <Gui config={config} onUpdate={setConfig} />
      <div className="animation">
        <animated.div onClick={runSpring} style={{ x }} />
        {ghosts.map(({ x, color, index }) => (
          <div
            className="ghost"
            key={index}
            style={{ transform: `translateX(${x}px)`, backgroundColor: color }}
          />
        ))}
      </div>
      <div className="chart">
        {data.map(({ datasets, perfs, title }, i) => (
          <Chart
            key={i}
            index={i}
            title={title}
            datasets={datasets}
            perfs={perfs}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  )
}
