import React from 'react';

/**
 * LK ROBOTICS — PushBadge
 * A notification overlay pinned to the top-right of its child (an icon /
 * avatar). `dot` shows a bare status dot; a `count` shows a number (clamped at
 * `max`). White ring so it reads on any surface.
 */
export function PushBadge({ children, count, dot = false, max = 99, tone = 'negative', style, ...rest }) {
  const c = tone === 'signal' ? 'var(--color-semantic-primary-normal)' : tone === 'navy' ? 'var(--color-semantic-inverse-background)' : 'var(--color-semantic-status-negative)';
  const show = dot || (count != null && count > 0);
  const label = count > max ? `${max}+` : count;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }} {...rest}>
      {children}
      {show && (dot ? (
        <span style={{ position: 'absolute', top: -1, right: -1, width: 9, height: 9, borderRadius: '50%', background: c, border: '2px solid var(--color-semantic-background-elevated-normal)', boxSizing: 'content-box' }} />
      ) : (
        <span style={{ position: 'absolute', top: -7, right: -9, minWidth: 18, height: 18, padding: '0 5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c, color: 'var(--color-semantic-static-white)', borderRadius: 'var(--radius-pill)', border: '2px solid var(--color-semantic-background-elevated-normal)', boxSizing: 'content-box', fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 'var(--fw-bold)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{label}</span>
      ))}
    </span>
  );
}
