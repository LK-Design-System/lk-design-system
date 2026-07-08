import React from 'react';

/**
 * LK ROBOTICS — Stat
 * Big extrabold numeral + caption. Patterns like "2024 설립", "5억원 매출".
 * `stacked` puts the caption beneath; default is inline-baseline.
 */
export function Stat({
  value,
  label,
  accent = 'ink',
  dark = false,
  stacked = false,
  style,
  ...rest
}) {
  const colors = { ink: 'var(--color-semantic-label-strong)', signal: 'var(--color-semantic-primary-normal)', steel: 'var(--bw-green-600)' };
  const valColor = dark ? 'var(--color-semantic-static-white)' : (colors[accent] || colors.ink);
  const labColor = dark ? 'var(--text-on-dark-muted)' : 'var(--color-semantic-label-alternative)';
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
      <span style={{ fontSize: '40px', fontWeight: 'var(--fw-extra)', letterSpacing: 0, lineHeight: 1, color: valColor, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <span style={{ fontSize: '15px', lineHeight: 1.5, maxWidth: stacked ? 'none' : 160, color: labColor, wordBreak: 'keep-all' }}>{label}</span>
    </div>
  );
}
