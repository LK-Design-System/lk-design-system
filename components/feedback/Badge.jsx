import React from 'react';

const PALETTES = {
  signal: { bg: 'var(--component-badge-signal-bg)', fg: 'var(--component-badge-signal-fg)', dot: 'var(--color-semantic-primary-normal)' },
  navy: { bg: 'var(--component-badge-navy-bg)', fg: 'var(--component-badge-navy-fg)', dot: 'var(--color-semantic-secondary-normal)' },
  steel: { bg: 'var(--component-badge-steel-bg)', fg: 'var(--component-badge-steel-fg)', dot: 'var(--color-semantic-accent-foreground-blue)' },
  amber: { bg: 'var(--component-badge-cautionary-bg)', fg: 'var(--component-badge-cautionary-fg)', dot: 'var(--color-semantic-status-cautionary-foreground)' },
  red: { bg: 'var(--component-badge-negative-bg)', fg: 'var(--component-badge-negative-fg)', dot: 'var(--color-semantic-status-negative-foreground)' },
  // aliases
  indigo: { bg: 'var(--component-badge-navy-bg)', fg: 'var(--component-badge-navy-fg)', dot: 'var(--color-semantic-secondary-normal)' },
  green: { bg: 'var(--component-badge-positive-bg)', fg: 'var(--component-badge-positive-fg)', dot: 'var(--color-semantic-status-positive-foreground)' },
  ink: { bg: 'var(--component-badge-navy-bg)', fg: 'var(--component-badge-navy-fg)', dot: 'var(--color-semantic-secondary-normal)' },
};

/* Counts overflow like PushBadge: values above `max` render as "max+". Only a
   numeric (or numeric-string) child is treated as a count; text labels such as
   "점검" are never clamped. */
function clampCount(children, max) {
  if (max == null) return children;
  if (typeof children === 'number') return children > max ? `${max}+` : children;
  if (typeof children === 'string' && /^\d+$/.test(children.trim())) {
    const value = Number(children.trim());
    return value > max ? `${max}+` : children;
  }
  return children;
}

/**
 * LK ROBOTICS — Badge
 * Small status/count token — a solid r4 rounded-rect with white text
 * (source `_Badge/Value` spec: r4 / h20 / padX6).
 *
 * `dot` prefixes the label with a tone-coloured status dot. Meaning is never
 * carried by the dot colour alone (WCAG 1.4.1): with `children` the text stays
 * visible next to the dot; without `children` the dot is decorative
 * (`aria-hidden`) unless an `aria-label` / `aria-labelledby` is supplied, which
 * promotes it to a named `role="img"`.
 */
// Optical gap between the 8px status dot and its label: 4px reads as touching
// at this dot size, 8px reads as two separate items.
const DOT_LABEL_GAP = 6;

export function Badge({ children, tone = 'signal', dot = false, max = 99, style, ...rest }) {
  const palette = PALETTES[tone] || PALETTES.signal;
  const label = clampCount(children, max);
  const hasLabel = label != null && label !== false && label !== '';
  const named = rest['aria-label'] != null || rest['aria-labelledby'] != null;

  const dotStyle = {
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
    background: palette.dot, flexShrink: 0,
  };

  if (dot) {
    /* Bare dot: geometry is unchanged from the marker-only Badge. It stays
       decorative unless the consumer supplied an accessible name — a lone
       coloured dot with no name is nothing an assistive technology can read. */
    if (!hasLabel) {
      return (
        <span
          role={named ? 'img' : undefined}
          aria-hidden={named ? undefined : 'true'}
          style={{ ...dotStyle, ...style }}
          {...rest}
        />
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: DOT_LABEL_GAP,
          fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--caption1-size)',
          color: 'var(--color-semantic-label-normal)',
          ...style,
        }}
        {...rest}
      >
        <span aria-hidden="true" style={dotStyle} />
        {label}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 20, height: 20, padding: '0 6px',
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--caption1-size)',
        color: palette.fg, background: palette.bg, borderRadius: 4, /* WDS _Badge/Value r4 (no 4px token) */
        ...style,
      }}
      {...rest}
    >
      {label}
    </span>
  );
}
