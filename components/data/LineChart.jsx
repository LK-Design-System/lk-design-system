import React from 'react';
import { Legend } from './Legend.jsx';

const PALETTE = [
  'var(--color-semantic-primary-normal)',
  'var(--color-semantic-status-positive)',
  'var(--color-semantic-status-cautionary)',
  'var(--color-semantic-status-negative)',
  'var(--color-semantic-accent-foreground-violet)',
];

function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}

function normalizeSeries(series) {
  return series.map((item, index) => ({
    ...item,
    id: item.id ?? item.name ?? index,
    points: (item.points || [])
      .filter((point) => isFiniteNumber(point.x) && isFiniteNumber(point.y))
      .map((point) => ({ x: Number(point.x), y: Number(point.y) })),
  }));
}

function resolveDomain(values, explicitDomain, fallback, includeZero = false) {
  if (Array.isArray(explicitDomain) && explicitDomain.length === 2) {
    const [min, max] = explicitDomain;
    if (isFiniteNumber(min) && isFiniteNumber(max) && Number(min) !== Number(max)) {
      return [Number(min), Number(max)];
    }
  }

  if (!values.length) return fallback;

  let min = Math.min(...values);
  let max = Math.max(...values);
  if (includeZero) {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  if (min === max) {
    const delta = Math.abs(min) || 1;
    return [min - delta * 0.5, max + delta * 0.5];
  }
  return [min, max];
}

function buildTicks(min, max, count) {
  const safeCount = Math.max(1, Math.floor(count));
  if (safeCount === 1) return [min];
  return Array.from({ length: safeCount }, (_, index) => min + ((max - min) * index) / (safeCount - 1));
}

function resolveTickValues(min, max, ticks, fallbackCount) {
  if (Array.isArray(ticks)) {
    const values = ticks.filter(isFiniteNumber).map(Number);
    return values.length ? values : buildTicks(min, max, fallbackCount);
  }
  return buildTicks(min, max, ticks ?? fallbackCount);
}

function linePath(points, sx, sy) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${sx(point.x).toFixed(2)} ${sy(point.y).toFixed(2)}`)
    .join(' ');
}

function defaultFormatY(value) {
  return Math.abs(value) >= 100 ? Math.round(value) : Math.round(value * 100) / 100;
}

function defaultFormatX(value) {
  return `${value}`;
}

/**
 * LDS Product Data — LineChart
 * Multi-series SVG line chart for training curves and telemetry trends. It stays
 * presentational: host code owns data, formatters, and domain decisions.
 */
export function LineChart({
  series = [],
  width = 520,
  height = 240,
  xLabel,
  yLabel,
  xTicks = 2,
  yTicks = 4,
  xDomain,
  yDomain,
  includeZero = true,
  showGrid = true,
  showLegend = true,
  showPoints = false,
  referenceLines = [],
  emptyLabel = '데이터가 없습니다',
  formatX,
  formatY,
  description,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const normalized = normalizeSeries(series);
  const allPoints = normalized.flatMap((item) => item.points);
  const chartWidth = Math.max(160, Number(width) || 520);
  const chartHeight = Math.max(120, Number(height) || 240);
  const pad = { top: 14, right: 22, bottom: xLabel ? 38 : 30, left: 46 };
  const innerWidth = Math.max(1, chartWidth - pad.left - pad.right);
  const innerHeight = Math.max(1, chartHeight - pad.top - pad.bottom);
  const [xMin, xMax] = resolveDomain(allPoints.map((point) => point.x), xDomain, [0, 1]);
  const [yMin, yMax] = resolveDomain(allPoints.map((point) => point.y), yDomain, [0, 1], includeZero);
  const xTickValues = resolveTickValues(xMin, xMax, xTicks, 2);
  const yTickValues = buildTicks(yMin, yMax, Math.max(2, yTicks + 1));
  const sx = (x) => pad.left + ((x - xMin) / (xMax - xMin)) * innerWidth;
  const sy = (y) => pad.top + innerHeight - ((y - yMin) / (yMax - yMin)) * innerHeight;
  const fx = formatX || defaultFormatX;
  const fy = formatY || defaultFormatY;
  const hasData = allPoints.length > 0;
  const rawId = React.useId();
  const clipId = `line-chart-${rawId.replace(/:/g, '')}-clip`;
  const chartLabel = ariaLabel || (yLabel ? `${yLabel} 라인 차트` : '라인 차트');
  const legendItems = normalized.map((item, index) => ({
    id: item.id,
    label: item.name ?? `시리즈 ${index + 1}`,
    color: item.color || PALETTE[index % PALETTE.length],
    shape: 'line',
    dashed: item.dashed,
    disabled: item.points.length === 0,
  }));

  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--space-3)',
        width: '100%',
        maxWidth: chartWidth,
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
        aria-label={chartLabel}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: `${chartWidth} / ${chartHeight}`,
          overflow: 'visible',
        }}
      >
        {description && <desc>{description}</desc>}
        <defs>
          <clipPath id={clipId}>
            <rect x={pad.left} y={pad.top} width={innerWidth} height={innerHeight} />
          </clipPath>
        </defs>

        {showGrid &&
          yTickValues.map((tick) => (
            <line
              key={`grid-${tick}`}
              x1={pad.left}
              y1={sy(tick)}
              x2={pad.left + innerWidth}
              y2={sy(tick)}
              stroke="var(--color-semantic-line-normal-alternative)"
              strokeWidth="1"
            />
          ))}

        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + innerHeight}
          stroke="var(--color-semantic-line-normal-normal)"
          strokeWidth="1"
        />
        <line
          x1={pad.left}
          y1={pad.top + innerHeight}
          x2={pad.left + innerWidth}
          y2={pad.top + innerHeight}
          stroke="var(--color-semantic-line-normal-normal)"
          strokeWidth="1"
        />

        {yTickValues.map((tick) => (
          <text
            key={`y-${tick}`}
            x={pad.left - 8}
            y={sy(tick) + 3}
            textAnchor="end"
            fontSize="10"
            fill="var(--color-semantic-label-assistive)"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {fy(tick)}
          </text>
        ))}

        {xTickValues.map((tick, index) => (
          <text
            key={`x-${tick}`}
            x={sx(tick)}
            y={pad.top + innerHeight + 16}
            textAnchor={index === 0 ? 'start' : index === xTickValues.length - 1 ? 'end' : 'middle'}
            fontSize="10"
            fill="var(--color-semantic-label-assistive)"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {fx(tick)}
          </text>
        ))}

        {yLabel && (
          <text
            x={14}
            y={pad.top + innerHeight / 2}
            transform={`rotate(-90 14 ${pad.top + innerHeight / 2})`}
            textAnchor="middle"
            fontSize="10"
            fontWeight="var(--fw-semibold)"
            fill="var(--color-semantic-label-alternative)"
          >
            {yLabel}
          </text>
        )}

        {referenceLines
          .filter((line) => isFiniteNumber(line.y) && Number(line.y) >= yMin && Number(line.y) <= yMax)
          .map((line, index) => {
            const y = sy(Number(line.y));
            const color = line.color || 'var(--color-semantic-status-cautionary)';
            return (
              <g key={line.id ?? line.label ?? index}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={pad.left + innerWidth}
                  y2={y}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeDasharray={line.dashed === false ? undefined : '4 4'}
                />
                {line.label != null && (
                  <text
                    x={pad.left + innerWidth - 4}
                    y={y - 5}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="var(--fw-semibold)"
                    fill={color}
                  >
                    {line.label}
                  </text>
                )}
              </g>
            );
          })}

        <g clipPath={`url(#${clipId})`}>
          {normalized.map((item, index) => {
            const color = item.color || PALETTE[index % PALETTE.length];
            const path = linePath(item.points, sx, sy);

            return (
              <g key={item.id}>
                {item.points.length > 1 && (
                  <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeDasharray={item.dashed ? '5 4' : undefined}
                  />
                )}
                {(showPoints || item.points.length === 1) &&
                  item.points.map((point, pointIndex) => (
                    <circle
                      key={`${item.id}-${pointIndex}`}
                      cx={sx(point.x)}
                      cy={sy(point.y)}
                      r="3"
                      fill="var(--color-semantic-background-elevated-normal)"
                      stroke={color}
                      strokeWidth="2"
                    />
                  ))}
              </g>
            );
          })}
        </g>

        {!hasData && (
          <text
            x={pad.left + innerWidth / 2}
            y={pad.top + innerHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fontWeight="var(--fw-medium)"
            fill="var(--color-semantic-label-assistive)"
          >
            {emptyLabel}
          </text>
        )}
      </svg>

      {showLegend && normalized.length > 0 && (
        <Legend
          items={legendItems}
          size="sm"
          aria-label="라인 차트 범례"
          style={{ paddingLeft: pad.left, maxWidth: '100%' }}
        />
      )}

      {xLabel && (
        <div
          style={{
            textAlign: 'center',
            fontSize: 'var(--caption1-size)',
            lineHeight: 'var(--caption1-line)',
            color: 'var(--color-semantic-label-alternative)',
          }}
        >
          {xLabel}
        </div>
      )}
    </div>
  );
}
