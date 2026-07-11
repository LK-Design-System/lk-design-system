import React from 'react';
import { StatusBadge } from '../content/StatusBadge.jsx';

const STATUS_LABEL = {
  signal: '정보',
  positive: '정상',
  cautionary: '주의',
  negative: '위험',
};

/**
 * LK ROBOTICS — TelemetryValue
 * Compact telemetry readout for rows and dense panels. The numeric value stays
 * on a high-contrast neutral foreground; semantic tone is always paired with a
 * visible status label instead of being communicated by text colour alone.
 */
export function TelemetryValue({
  label,
  value,
  unit,
  tone = 'neutral',
  statusLabel,
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
  const resolvedTone = stale ? 'cautionary' : tone;
  const hasCustomStatusLabel = statusLabel != null && statusLabel !== false && statusLabel !== '';
  const hasCustomStaleLabel = staleLabel != null && staleLabel !== false && staleLabel !== '';
  const resolvedStatusLabel = stale
    ? (hasCustomStaleLabel ? staleLabel : '지연')
    : (hasCustomStatusLabel ? statusLabel : (tone === 'neutral' ? null : STATUS_LABEL[tone]));
  const showStatus = resolvedStatusLabel != null && (!stale || showStaleBadge);
  const valueSize = size === 'sm' ? 18 : 21;
  const justifyContent = align === 'end' ? 'flex-end' : 'flex-start';

  return (
    <div
      data-tone={resolvedTone}
      data-stale={stale ? 'true' : undefined}
      style={{
        display: 'grid',
        gap: 'var(--space-1)',
        justifyItems: align === 'end' ? 'end' : 'start',
        maxWidth: '100%',
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-semantic-label-normal)',
        ...style,
      }}
      {...rest}
    >
      {label != null && (
        <span style={{ maxWidth: '100%', color: 'var(--color-semantic-label-neutral)', fontSize: 12, lineHeight: 1.35, fontWeight: 'var(--fw-bold)', overflowWrap: 'anywhere', textAlign: align === 'end' ? 'right' : 'left' }}>
          {label}
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent, columnGap: 'var(--space-2)', rowGap: 'var(--space-1)', maxWidth: '100%', minWidth: 0, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 'var(--space-1)', maxWidth: '100%', minWidth: 0 }}>
          <strong style={{ maxWidth: '100%', color: stale ? 'var(--color-semantic-label-neutral)' : 'var(--color-semantic-label-strong)', fontSize: valueSize, lineHeight: 1.12, fontWeight: 'var(--fw-extra)', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>
            {value}
          </strong>
          {unit != null && (
            <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: size === 'sm' ? 12 : 13, lineHeight: 1.25, fontWeight: 'var(--fw-bold)', overflowWrap: 'anywhere' }}>
              {unit}
            </span>
          )}
        </span>
        {showStatus && <StatusBadge tone={resolvedTone}>{resolvedStatusLabel}</StatusBadge>}
      </div>

      {(helper != null || timestamp != null) && (
        <div style={{ display: 'flex', justifyContent, columnGap: 'var(--space-2)', rowGap: 2, maxWidth: '100%', minWidth: 0, flexWrap: 'wrap', color: 'var(--color-semantic-label-neutral)', fontSize: 11.5, lineHeight: 1.4, fontVariantNumeric: 'tabular-nums', textAlign: align === 'end' ? 'right' : 'left' }}>
          {helper != null && <span style={{ maxWidth: '100%', overflowWrap: 'anywhere' }}>{helper}</span>}
          {helper != null && timestamp != null && <span aria-hidden="true">·</span>}
          {timestamp != null && <span style={{ maxWidth: '100%', overflowWrap: 'anywhere' }}>{timestamp}</span>}
        </div>
      )}
    </div>
  );
}
