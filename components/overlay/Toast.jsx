import React from 'react';

const TT = {
  info: { c: 'var(--lk-accent-ink)', d: '<circle cx="12" cy="12" r="9"/><path d="M12 11.5v5"/><path d="M12 8h.01"/>' },
  success: { c: 'var(--bw-green)', d: '<circle cx="12" cy="12" r="9"/><path d="m8.4 12 2.6 2.6 4.6-5.2"/>' },
  warning: { c: 'var(--bw-amber)', d: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>' },
  error: { c: 'var(--bw-red)', d: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>' },
};

/**
 * LK ROBOTICS — Toast
 * A floating transient message — a LIGHT elevated card (hairline + soft shadow),
 * a tonal leading icon, an optional action link and close. Matches Notification's
 * light treatment; in dark mode it lifts to an elevated dark card. Presentational:
 * pair with your own timeout + viewport stacking.
 */
export function Toast({ tone = 'info', children, action, onClose, style, ...rest }) {
  const t = TT[tone] || TT.info;
  return (
    <div
      role="status"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12, maxWidth: 440, padding: '13px 16px',
        background: 'var(--surface-card)', color: 'var(--label-normal)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
        fontFamily: 'var(--font-sans)', ...style,
      }}
      {...rest}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: t.d }} />
      <span style={{ flex: 1, fontSize: 14, lineHeight: 1.5, letterSpacing: 0, color: 'var(--label-neutral)', wordBreak: 'keep-all' }}>{children}</span>
      {action != null && <span style={{ flexShrink: 0, color: 'var(--accent-text)', fontSize: 14, fontWeight: 'var(--fw-bold)', cursor: 'pointer' }}>{action}</span>}
      {onClose && (
        <button type="button" aria-label="close" onClick={onClose} style={{ flexShrink: 0, display: 'inline-flex', padding: 2, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--label-assistive)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}
