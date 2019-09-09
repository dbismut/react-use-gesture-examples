import React from 'react'
import { Scatter } from 'react-chartjs-2'

export default function Chart({ index, title, datasets, perfs, onHover }) {
  return (
    <div>
      <h3>{title}</h3>
      <Scatter
        data={{ datasets }}
        options={{
          onHover: (_, data) => onHover(index, data),
          tooltips: { mode: 'index', axis: 'x', intersect: false },
          hover: { mode: 'index', axis: 'x', intersect: false },
          scales: {
            yAxes: [{ ticks: { suggestedMin: 0, suggestedMax: 600 } }],
            xAxes: [{ ticks: { suggestedMin: 0, suggestedMax: 1000 } }],
          },
        }}
      />
      <div style={{ marginTop: 10 }}>
        {perfs.map(({ label, sum, mean, max, cycles }) => (
          <div key={label}>
            <b>{label}: </b>sum (first 30) {sum.toFixed(3)}, mean{' '}
            {mean.toFixed(4)}, max {max.toFixed(4)}, cycles: {cycles}
          </div>
        ))}
      </div>
    </div>
  )
}