import React from 'react';
import { VisuallyHidden } from '@lk-robotics/lds-core/components/layout/VisuallyHidden';

function nodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).filter(Boolean).join(' ');
  if (React.isValidElement(node)) return nodeText(node.props.children);
  return '';
}

function joinIds(...ids) {
  return ids.filter(Boolean).join(' ') || undefined;
}

/**
 * LDS Product Data — BarChart
 * Simple vertical bars from `data` ({ label, value, color? }). Signal-ink bars
 * on a shared max scale, with value + label. For compact comparisons.
 */
export function BarChart({
  data = [],
  height = 160,
  gap = 12,
  showValue = true,
  color = 'var(--color-semantic-primary-normal)',
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
  const values = data.map((datum) => {
    const value = Number(datum.value);
    return Number.isFinite(value) ? value : 0;
  });
  const max = Math.max(...values.map((value) => Math.max(0, value)), 1);
  const hasData = data.length > 0;
  const automaticSummary = hasData
    ? data.map((datum, index) => {
      const label = datum.accessibleLabel || nodeText(datum.label) || `항목 ${index + 1}`;
      return `${label}: ${values[index]}`;
    }).join(', ')
    : (nodeText(emptyLabel) || '데이터가 없습니다.');
  const resolvedSummary = summary ?? automaticSummary;

  return (
    <div
      role="img"
      aria-label={ariaLabel || '막대 차트'}
      aria-describedby={joinIds(ariaDescribedBy, description != null && descriptionId, resolvedSummary != null && summaryId)}
      data-chart-type="bar"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: hasData ? 'flex-start' : 'center',
        gap,
        height,
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {description != null && <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden>}
      {resolvedSummary != null && <VisuallyHidden id={summaryId} data-chart-summary>{resolvedSummary}</VisuallyHidden>}
      {!hasData && (
        <span
          data-chart-empty
          style={{
            alignSelf: 'center',
            color: 'var(--color-semantic-label-alternative)',
            fontSize: 'var(--label2-size)',
            lineHeight: 'var(--label2-line)',
            textAlign: 'center',
          }}
        >
          {emptyLabel}
        </span>
      )}
      {data.map((datum, index) => {
        const value = values[index];
        const barHeight = `${(Math.max(0, value) / max) * 100}%`;
        return (
          <div
            key={datum.id ?? index}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            {showValue && (
              <span style={{ fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>
                {datum.value}
              </span>
            )}
            <div
              aria-hidden="true"
              data-bar-value={value}
              style={{
                width: '100%',
                maxWidth: 48,
                height: barHeight,
                minHeight: 2,
                background: datum.color || color,
                borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                transition: 'height var(--dur-slow) var(--ease-out)',
              }}
            />
            <span
              data-chart-label
              style={{
                width: '100%',
                minWidth: 0,
                color: 'var(--color-semantic-label-alternative)',
                fontSize: 'var(--caption1-size)',
                lineHeight: 'var(--caption1-line)',
                overflowWrap: 'anywhere',
                textAlign: 'center',
                whiteSpace: 'normal',
              }}
            >
              {datum.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
