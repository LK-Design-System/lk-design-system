import React from 'react';

/**
 * LDS Product Data — Sparkline
 * A tiny inline trend chart from a number array — signal-ink stroke with a soft
 * area fill. No axes; for compact stat rows.
 */
export function Sparkline({ data = [], width = 120, height = 32, color = 'var(--color-semantic-primary-normal)', fill = true, strokeWidth = 2, style, ...rest }) {
  const {
    description,
    summary,
    emptyLabel = '데이터가 없습니다.',
    formatValue = (value) => `${value}`,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    role = 'img',
    ...svgProps
  } = rest;
  const values = data.map(Number).filter(Number.isFinite);
  const hasData = values.length > 0;
  const min = hasData ? Math.min(...values) : 0;
  const max = hasData ? Math.max(...values) : 0;
  const range = max - min || 1;
  const pts = values.map((value, index) => [(index / (values.length - 1 || 1)) * width, height - ((value - min) / range) * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const automaticSummary = hasData
    ? `${values.length}개 값. 시작 ${formatValue(values[0])}, 최저 ${formatValue(min)}, 최고 ${formatValue(max)}, 마지막 ${formatValue(values[values.length - 1])}.`
    : emptyLabel;
  const resolvedSummary = summary ?? automaticSummary;
  const rawId = React.useId();
  const titleId = `${rawId}-title`;
  const descriptionId = `${rawId}-description`;
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : titleId}
      aria-describedby={describedBy}
      data-chart-type="sparkline"
      style={{ display: 'block', maxWidth: '100%', height: 'auto', aspectRatio: `${width} / ${height}`, ...style }}
      {...svgProps}
    >
      <title id={titleId}>{ariaLabel || '추세 차트'}</title>
      <desc id={descriptionId} data-chart-summary>{[description, resolvedSummary].filter(Boolean).join(' ')}</desc>
      {!hasData && (
        <text
          data-chart-empty
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-semantic-label-alternative)"
          fontSize={Math.min(12, Math.max(9, height * 0.28))}
          fontWeight="var(--fw-medium)"
        >
          {emptyLabel}
        </text>
      )}
      {hasData && fill && <path aria-hidden="true" d={area} fill={color} opacity="0.12" />}
      {hasData && <path aria-hidden="true" d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}
