import React from 'react';
import { isAttachedUnit, normalizeUnit } from '@lk-design-system/lds-core/components/internal/unit-format';

/**
 * LK ROBOTICS — Stat
 * Big extrabold numeral + caption. Patterns like "2024 설립", "5억원 매출".
 * `stacked` puts the caption beneath; default is inline-baseline.
 */
export function Stat({
  value,
  unit,
  label,
  accent = 'ink',
  dark = false,
  stacked = false,
  style,
  ...rest
}) {
  const colors = { ink: 'var(--color-semantic-label-strong)', signal: 'var(--color-semantic-primary-normal)', steel: 'var(--color-semantic-accent-foreground-blue)' };
  const valColor = dark ? 'var(--color-semantic-static-white)' : (colors[accent] || colors.ink);
  const labColor = dark ? 'var(--color-semantic-inverse-label-neutral-soft)' : 'var(--color-semantic-label-alternative)';
  const displayUnit = typeof unit === 'string' ? normalizeUnit(unit) : unit;
  const attachedUnit = typeof displayUnit === 'string' && isAttachedUnit(displayUnit);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'flex-start' : 'baseline',
        gap: stacked ? '6px' : '14px',
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: attachedUnit ? 0 : '0.25em', color: valColor }}>
        <span style={{ fontSize: 'var(--display2-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {displayUnit != null && displayUnit !== '' && <span style={{ fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)', fontWeight: 'var(--fw-semibold)' }}>{displayUnit}</span>}
      </span>
      <span style={{ fontSize: 'var(--body2-size)', lineHeight: 1.5, maxWidth: stacked ? 'none' : 160, color: labColor, wordBreak: 'keep-all' }}>{label}</span>
    </div>
  );
}
