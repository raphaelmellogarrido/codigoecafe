// src/pages/projects/DashboardAnalytics/LineChart.jsx
// Gráfico de linha "híbrido": o D3 calcula escalas, eixos e o path da linha;
// o React trata da renderização declarativa dos elementos SVG.

import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';

const WIDTH = 640;
const HEIGHT = 280;
const MARGIN = { top: 20, right: 20, bottom: 30, left: 50 };

export default function LineChart({ data }) {
  const axisBottomRef = useRef(null);
  const axisLeftRef = useRef(null);

  const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

  const x = useMemo(
    () =>
      d3
        .scaleTime()
        .domain(d3.extent(data, (d) => new Date(d.date)))
        .range([0, innerWidth]),
    [data, innerWidth]
  );

  const y = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) * 1.15])
        .range([innerHeight, 0]),
    [data, innerHeight]
  );

  const linePath = useMemo(
    () =>
      d3
        .line()
        .x((d) => x(new Date(d.date)))
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX)(data),
    [data, x, y]
  );

  const areaPath = useMemo(
    () =>
      d3
        .area()
        .x((d) => x(new Date(d.date)))
        .y0(innerHeight)
        .y1((d) => y(d.value))
        .curve(d3.curveMonotoneX)(data),
    [data, x, y, innerHeight]
  );

  useEffect(() => {
    d3.select(axisBottomRef.current).call(
      d3.axisBottom(x).ticks(6).tickSize(0).tickFormat(d3.timeFormat('%d/%m'))
    );
    d3.select(axisLeftRef.current).call(
      d3.axisLeft(y).ticks(5).tickSize(0).tickFormat((v) => `€${v / 1000}k`)
    );
  }, [x, y]);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="chart-svg">
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#revenueGradient)" />
        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="2.5" />
        <g ref={axisBottomRef} transform={`translate(0,${innerHeight})`} className="chart-axis" />
        <g ref={axisLeftRef} className="chart-axis" />
      </g>
    </svg>
  );
}
