import React from 'react';

// Tone colours the value text, so amber/red map to the AA-contrast variants
// (--color-cautionary-strong / --color-danger-text) rather than the raw hues,
// which fall below WCAG-AA as text on the panel surface.
const TONE = {
  neutral: 'var(--label-neutral)',
  signal: 'var(--lk-accent-ink)',
  positive: 'var(--color-positive)',
  cautionary: 'var(--color-cautionary-strong)',
  negative: 'var(--color-danger-text)',
};

/**
 * LK ROBOTICS — TelemetryValue
 * Compact telemetry readout for rows, table cells, and dense panels. It keeps value, unit,
 * threshold tone, freshness, and timestamp together so real-time numbers do not
 * look fresher or safer than they are.
 */
export function TelemetryValue({
  label,
  value,
  unit,
  tone = 'neutral',
  timestamp,
  stale = false,
  staleLabel = '지연',
  showStaleBadge = true,
  helper,
  align = 'start',
  size = 'md',
  style,
  ...rest
}) {
  const color = stale ? 'var(--label-assistive)' : (TONE[tone] || TONE.neutral);
  const valueSize = size === 'sm' ? 18 : 21;
  return (
    <div
      style={{
        display: 'grid',
        gap: 4,
        justifyItems: align === 'end' ? 'end' : 'start',
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        color: 'var(--label-normal)',
        ...style,
      }}
      {...rest}
    >
      {label != null && <span style={{ color: 'var(--label-alternative)', fontSize: 12, lineHeight: 1.35, fontWeight: 'var(--fw-bold)' }}>{label}</span>}
      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 5, minWidth: 0 }}>
        <strong style={{ color, fontSize: valueSize, lineHeight: 1.12, fontWeight: 'var(--fw-extra)', fontVariantNumeric: 'tabular-nums' }}>{value}</strong>
        {unit != null && <span style={{ color: stale ? 'var(--label-assistive)' : 'var(--label-alternative)', fontSize: size === 'sm' ? 12 : 13, fontWeight: 'var(--fw-bold)' }}>{unit}</span>}
        {stale && showStaleBadge && <span style={{ alignSelf: 'center', padding: '2px 6px', borderRadius: 'var(--radius-pill)', background: 'var(--fill-normal)', color: 'var(--label-alternative)', fontSize: 10.5, lineHeight: 1.2, fontWeight: 'var(--fw-bold)' }}>{staleLabel}</span>}
      </div>
      {(timestamp != null || helper != null) && (
        <span style={{ color: 'var(--label-assistive)', fontSize: 11.5, lineHeight: 1.35, fontVariantNumeric: 'tabular-nums' }}>
          {helper != null ? helper : timestamp}
        </span>
      )}
    </div>
  );
}
