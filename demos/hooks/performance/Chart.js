import React from 'react'
import { Scatter } from 'react-chartjs-2'

export default function Chart({ title, datasets, perfs }) {
  console.log(perfs)
  return (
    <div>
      <h3>{title}</h3>
      <Scatter
        data={{ datasets }}
        options={{
          scales: {
            yAxes: [{ ticks: { suggestedMin: 0, suggestedMax: 600 } }],
            xAxes: [{ ticks: { suggestedMin: 0, suggestedMax: 1000 } }],
          },
        }}
      />
      <div style={{ marginTop: 10 }}>
        {perfs.map(({ label, sum1000, mean, max, cycles }) => (
          <div key={label}>
            <b>{label}: </b>sum {sum1000.toFixed(3)}, mean {mean.toFixed(4)},
            max {max.toFixed(4)}, cycles: {cycles}
          </div>
        ))}
      </div>
    </div>
  )
}
