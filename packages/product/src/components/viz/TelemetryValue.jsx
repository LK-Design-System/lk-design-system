import React from 'react';
import { StatusBadge } from '@lk-design-system/lds-core/components/content/StatusBadge';
import {
  getUnitSeparator,
  isAttachedUnit,
  normalizeUnit,
  normalizeValueText,
} from '@lk-design-system/lds-core/component-authoring';
import { TELEMETRY_STATUS_LABEL as STATUS_LABEL } from '../internal/telemetryStatusLabel.js';

/* A metric with nothing behind it yet. Consumers write the placeholder as a
   dash (Cloudscape's key-value convention for an empty value), and it must not
   end up the loudest thing in a readout: the display weight and the strong ink
   are reserved for a value that actually exists. The type step is kept so a row
   of tiles stays on the same baseline grid. */
const EMPTY_VALUE_TEXT = /^[-‐-―]$/u;

/* Vertical stacks the label over a display-scale value — a KPI tile. Horizontal
   puts the pair on one line at a supporting-text scale, for a summary strip that
   runs beside single-line neighbours (badges, gauges, status chips). */
const VALUE_TYPE = {
  vertical: { sm: { size: 'var(--headline1-size)', line: 1.12 }, md: { size: 'var(--heading2-size)', line: 1.12 } },
  horizontal: { sm: { size: 'var(--label2-size)', line: 'var(--label2-line)' }, md: { size: 'var(--label1-size)', line: 'var(--label1-line)' } },
};
const UNIT_TYPE = {
  vertical: { sm: 12, md: 13 },
  horizontal: { sm: 'var(--caption2-size)', md: 'var(--caption1-size)' },
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
  orientation = 'vertical',
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
  const inline = orientation === 'horizontal';
  const density = size === 'sm' ? 'sm' : 'md';
  const valueType = VALUE_TYPE[inline ? 'horizontal' : 'vertical'][density];
  const unitSize = UNIT_TYPE[inline ? 'horizontal' : 'vertical'][density];
  const justifyContent = align === 'end' ? 'flex-end' : 'flex-start';
  const normalizedValue = normalizeValueText(value);
  const normalizedUnit = normalizeUnit(unit);
  const unitSeparator = getUnitSeparator(normalizedUnit);
  const attachedUnit = isAttachedUnit(normalizedUnit);
  const empty = normalizedValue === '' || EMPTY_VALUE_TEXT.test(normalizedValue);

  return (
    <div
      data-tone={resolvedTone}
      data-stale={stale ? 'true' : undefined}
      data-orientation={inline ? 'horizontal' : 'vertical'}
      data-empty={empty ? 'true' : undefined}
      style={{
        // Horizontal is one wrapping row so the pair still reflows at 320px
        // instead of overflowing the strip it was put in.
        ...(inline
          ? { display: 'flex', alignItems: 'center', justifyContent, columnGap: 'var(--space-1-5)', rowGap: 'var(--space-0-5)', flexWrap: 'wrap' }
          : { display: 'grid', gap: 'var(--space-1)', justifyItems: align === 'end' ? 'end' : 'start' }),
        maxWidth: '100%',
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-semantic-label-normal)',
        ...style,
      }}
      {...rest}
    >
      {label != null && (
        <span style={{ maxWidth: '100%', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: inline ? 'var(--caption1-line)' : 1.35, fontWeight: 'var(--fw-bold)', overflowWrap: 'anywhere', textAlign: align === 'end' ? 'right' : 'left' }}>
          {label}
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent, columnGap: 'var(--space-2)', rowGap: 'var(--space-1)', maxWidth: '100%', minWidth: 0, flexWrap: 'wrap' }}>
        <strong
          data-telemetry-value-lockup=""
          data-unit-attachment={normalizedUnit === '' ? 'none' : attachedUnit ? 'attached' : 'spaced'}
          style={{ display: 'inline-block', maxWidth: '100%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: stale || empty ? 'var(--color-semantic-label-neutral)' : 'var(--color-semantic-label-strong)', fontSize: valueType.size, lineHeight: valueType.line, fontWeight: empty ? 'var(--fw-bold)' : 'var(--fw-extra)', fontVariantNumeric: 'tabular-nums' }}
        >
          <span>{normalizedValue}</span>
          {normalizedUnit !== '' && (
            <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: unitSize, lineHeight: 1.25, fontWeight: 'var(--fw-bold)' }}>
              {unitSeparator}{normalizedUnit}
            </span>
          )}
        </strong>
        {showStatus && <StatusBadge tone={resolvedTone}>{resolvedStatusLabel}</StatusBadge>}
      </div>

      {(helper != null || timestamp != null) && (
        <div style={{ display: 'flex', justifyContent, columnGap: 'var(--space-2)', rowGap: 2, maxWidth: '100%', minWidth: 0, flexWrap: 'wrap', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption2-size)', lineHeight: 1.4, fontVariantNumeric: 'tabular-nums', textAlign: align === 'end' ? 'right' : 'left' }}>
          {helper != null && <span style={{ maxWidth: '100%', overflowWrap: 'anywhere' }}>{helper}</span>}
          {helper != null && timestamp != null && <span aria-hidden="true">·</span>}
          {timestamp != null && <span style={{ maxWidth: '100%', overflowWrap: 'anywhere' }}>{timestamp}</span>}
        </div>
      )}
    </div>
  );
}
