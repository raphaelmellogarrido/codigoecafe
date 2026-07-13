// src/pages/projects/DashboardAnalytics/BarChart.jsx
// Gráfico de barras horizontal: D3 calcula as escalas (scaleBand/scaleLinear),
// React renderiza os <rect> declarativamente.

import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

const WIDTH = 480;
const HEIGHT = 240;
const MARGIN = { top: 10, right: 40, bottom: 10, left: 100 };
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#0ea5e9'];

export default function BarChart({ data }) {
  const axisLeftRef = useRef(null);

  const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

  const y = useMemo(
    () =>
      d3
        .scaleBand()
        .domain(data.map((d) => d.channel))
        .range([0, innerHeight])
        .padding(0.35),
    [data, innerHeight]
  );

  const x = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .range([0, innerWidth]),
    [data, innerWidth]
  );

  useEffect(() => {
    d3.select(axisLeftRef.current).call(d3.axisLeft(y).tickSize(0));
  }, [y]);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="chart-svg">
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        {data.map((d, i) => (
          <rect
            key={d.channel}
            x={0}
            y={y(d.channel)}
            width={x(d.value)}
            height={y.bandwidth()}
            rx={4}
            fill={COLORS[i % COLORS.length]}
          />
        ))}
        {data.map((d) => (
          <text
            key={`${d.channel}-label`}
            x={x(d.value) + 8}
            y={y(d.channel) + y.bandwidth() / 2}
            dy="0.35em"
            className="chart-bar-label"
          >
            {d.value}%
          </text>
        ))}
        <g ref={axisLeftRef} className="chart-axis" />
      </g>
    </svg>
  );
}
