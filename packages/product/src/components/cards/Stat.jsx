import React from 'react';
import { isAttachedUnit, normalizeUnit } from '@lk-design-system/lds-core/components/internal/unit-format';

/**
 * LK ROBOTICS — Stat
 * Big extrabold numeral + caption. Patterns like "2024 설립", "5억원 매출".
 * `stacked` puts the caption beneath; default is inline-baseline.
 *
 * Type resolves through `--lk-stat-*` re-point hooks whose fallbacks ARE the
 * former ramp values, so product surfaces render byte-identically while a
 * medium that reads farther away (a projection surface, a satellite)
 * re-points the hooks in its own scope — the same contract Table cells and
 * Timeline carry. Fourth instance of the pattern; the slide medium's
 * count-adaptive figure row was the requesting consumer
 * (lk-design-system-slides/docs/ADAPTIVE_CONTRACTS_PROPOSAL.md 변경 3).
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
        <span style={{ fontSize: 'var(--lk-stat-value-size, var(--display2-size))', fontWeight: 'var(--fw-extra)', letterSpacing: 'var(--lk-stat-value-spacing, 0)', lineHeight: 'var(--lk-stat-value-line, 1)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {displayUnit != null && displayUnit !== '' && <span style={{ fontSize: 'var(--lk-stat-unit-size, var(--body2-size))', lineHeight: 'var(--body2-line)', fontWeight: 'var(--fw-semibold)' }}>{displayUnit}</span>}
      </span>
      <span style={{ fontSize: 'var(--lk-stat-label-size, var(--body2-size))', lineHeight: 1.5, maxWidth: stacked ? 'none' : 160, color: labColor, wordBreak: 'keep-all' }}>{label}</span>
    </div>
  );
}
