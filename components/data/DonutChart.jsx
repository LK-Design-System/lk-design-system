import React from 'react';
import { VisuallyHidden } from '../layout/VisuallyHidden.jsx';

const PALETTE = [
  'var(--color-semantic-data-viz-series-1)',
  'var(--color-semantic-data-viz-series-2)',
  'var(--color-semantic-data-viz-series-3)',
  'var(--color-semantic-data-viz-series-4)',
  'var(--color-semantic-data-viz-series-5)',
  'var(--color-semantic-data-viz-series-6)',
];

function nodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).filter(Boolean).join(' ');
  if (React.isValidElement(node)) return nodeText(node.props.children);
  return '';
}

function joinIds(...ids) {
  return ids.filter(Boolean).join(' ') || undefined;
}

function numericValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

/**
 * LDS Product Data — DonutChart
 * A ring chart from `segments` ({ value, label, color }) with a centered total
 * and a side legend. Muted, cool palette by default.
 */
export function DonutChart({
  segments = [],
  size = 140,
  thickness = 18,
  showTotal = true,
  centerLabel,
  legend = true,
  description,
  summary,
  emptyLabel = '데이터가 없습니다.',
  style,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) {
  const rawId = React.useId();
  const descriptionId = `${rawId}-description`;
  const summaryId = `${rawId}-summary`;
  const values = segments.map((segment) => numericValue(segment.value));
  const total = values.reduce((sum, value) => sum + value, 0);
  const hasSegments = segments.length > 0;
  const hasPositiveTotal = total > 0;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const automaticSummary = !hasSegments
    ? (nodeText(emptyLabel) || '데이터가 없습니다.')
    : `합계 ${total}. ${segments.map((segment, index) => {
      const label = segment.accessibleLabel || nodeText(segment.label) || `항목 ${index + 1}`;
      const percentage = hasPositiveTotal ? Math.round((values[index] / total) * 100) : 0;
      return `${label}: ${values[index]} (${percentage}%)`;
    }).join(', ')}`;
  const resolvedSummary = summary ?? automaticSummary;
  const centerContent = centerLabel != null
    ? centerLabel
    : !hasSegments
      ? emptyLabel
      : showTotal
        ? total
        : null;

  return (
    <div
      role="img"
      aria-label={ariaLabel || '도넛 차트'}
      aria-describedby={joinIds(ariaDescribedBy, description != null && descriptionId, resolvedSummary != null && summaryId)}
      data-chart-type="donut"
      data-zero-sum={hasSegments && !hasPositiveTotal ? 'true' : undefined}
      style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 20, minWidth: 0, maxWidth: '100%', ...style }}
      {...rest}
    >
      {description != null && <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden>}
      {resolvedSummary != null && <VisuallyHidden id={summaryId} data-chart-summary>{resolvedSummary}</VisuallyHidden>}
      <span style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg aria-hidden="true" focusable="false" width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-semantic-fill-strong)" strokeWidth={thickness} />
          {hasPositiveTotal && segments.map((segment, index) => {
            const value = values[index];
            if (value <= 0) return null;
            const dash = (value / total) * circ;
            const el = (
              <circle
                data-donut-segment
                key={segment.id ?? index}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={segment.color || PALETTE[index % PALETTE.length]}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        {centerContent != null && (
          <span
            data-chart-center-value
            data-chart-empty={!hasSegments ? true : undefined}
            style={{
              position: 'absolute',
              inset: thickness,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              fontFamily: 'var(--font-sans)',
              fontSize: !hasSegments ? 'var(--caption1-size)' : size * 0.2,
              fontWeight: !hasSegments ? 'var(--fw-medium)' : 'var(--fw-extra)',
              lineHeight: 1.25,
              textAlign: 'center',
              overflowWrap: 'anywhere',
              color: !hasSegments ? 'var(--color-semantic-label-alternative)' : 'var(--color-semantic-label-normal)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {centerContent}
          </span>
        )}
      </span>
      {legend && segments.length > 0 && (
        <div aria-hidden="true" style={{ display: 'flex', flex: '1 1 132px', minWidth: 0, flexDirection: 'column', gap: 8 }}>
          {segments.map((segment, index) => {
            const percentage = hasPositiveTotal ? Math.round((values[index] / total) * 100) : 0;
            return (
              <span key={segment.id ?? index} style={{ display: 'grid', gridTemplateColumns: '10px minmax(0, 1fr) auto', alignItems: 'center', gap: 8, minWidth: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', color: 'var(--color-semantic-label-neutral)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: segment.color || PALETTE[index % PALETTE.length] }} />
                <span data-chart-label style={{ minWidth: 0, lineHeight: 'var(--label2-line)', overflowWrap: 'anywhere' }}>{segment.label}</span>
                <b style={{ marginLeft: 'var(--space-0-5)', color: 'var(--color-semantic-label-normal)', fontVariantNumeric: 'tabular-nums' }}>{percentage}%</b>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
