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

const LABEL_GAP = 8;

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
  // Bars share one grid row so every column measures the same track from the
  // same baseline, whatever height its wrapped label takes. The value label
  // rides above its own bar and overflows into the track's reserved padding,
  // which keeps it outside the 100% basis instead of compressing the tallest bar.
  const valueReserve = showValue ? `calc(var(--caption1-line) + ${LABEL_GAP}px)` : 0;

  return (
    <div
      role="img"
      aria-label={ariaLabel || '막대 차트'}
      aria-describedby={joinIds(ariaDescribedBy, description != null && descriptionId, resolvedSummary != null && summaryId)}
      data-chart-type="bar"
      style={{
        display: 'grid',
        gridTemplateColumns: hasData ? `repeat(${data.length}, minmax(0, 1fr))` : 'minmax(0, 1fr)',
        gridTemplateRows: hasData ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
        columnGap: gap,
        rowGap: LABEL_GAP,
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
          <React.Fragment key={datum.id ?? index}>
            <div
              style={{
                gridColumn: index + 1,
                gridRow: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: LABEL_GAP,
                paddingTop: valueReserve,
              }}
            >
              {showValue && (
                <span style={{ flexShrink: 0, fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>
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
                  flexShrink: 0,
                  background: datum.color || color,
                  borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                  transition: 'height var(--dur-slow) var(--ease-out)',
                }}
              />
            </div>
            <span
              data-chart-label
              style={{
                gridColumn: index + 1,
                gridRow: 2,
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
          </React.Fragment>
        );
      })}
    </div>
  );
}
