import React from 'react';

/**
 * LK ROBOTICS — ChecklistItem
 * Capability / feature row: signal-ink check (or red cross) + label. The
 * brand's most common list style (핵심 기능, 적용 현장).
 */
export function ChecklistItem({
  children,
  cross = false,
  muted = false,
  dark = false,
  style,
  ...rest
}) {
  const ok = !cross;
  const color = ok ? (dark ? 'var(--lk-accent)' : 'var(--lk-accent-ink)') : 'var(--bw-red)';
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', ...style }} {...rest}>
      <span style={{ display: 'inline-flex', flexShrink: 0, marginTop: 2, color }}>
        {ok ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        )}
      </span>
      <span style={{
        fontSize: '16.5px', fontWeight: 'var(--fw-semibold)', lineHeight: 1.5, letterSpacing: '-0.2px',
        color: dark ? 'var(--text-on-dark)' : muted ? 'var(--bw-gray)' : 'var(--bw-gray-700)',
        opacity: dark && muted ? 0.7 : 1,
        textDecoration: cross ? 'line-through' : 'none',
        wordBreak: 'keep-all',
      }}>
        {children}
      </span>
    </div>
  );
}
