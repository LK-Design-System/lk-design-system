import React from 'react';

const TONES = {
  info: { c: 'var(--component-banner-info-icon)', bg: 'var(--component-banner-info-bg)', border: 'var(--component-banner-info-border)', d: '<circle cx="12" cy="12" r="9"/><path d="M12 11.5v5"/><path d="M12 8h.01"/>' },
  success: { c: 'var(--component-banner-positive-icon)', bg: 'var(--component-banner-positive-bg)', border: 'var(--component-banner-positive-border)', d: '<circle cx="12" cy="12" r="9"/><path d="m8.4 12 2.6 2.6 4.6-5.2"/>' },
  warning: { c: 'var(--component-banner-cautionary-icon)', bg: 'var(--component-banner-cautionary-bg)', border: 'var(--component-banner-cautionary-border)', d: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>' },
  error: { c: 'var(--component-banner-negative-icon)', bg: 'var(--component-banner-negative-bg)', border: 'var(--component-banner-negative-border)', d: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>' },
};

/**
 * LK ROBOTICS — Banner
 * An inline notice bar — a tinted surface, a tonal leading icon, a message and
 * optional trailing action / close. Calm, hairline-bordered. For a floating
 * transient message use Toast.
 */
export function Banner({ tone = 'info', title, children, action, onClose, style, ...rest }) {
  const t = TONES[tone] || TONES.info;
  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 'var(--radius-lg)', fontFamily: 'var(--font-sans)', ...style,
      }}
      {...rest}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }} dangerouslySetInnerHTML={{ __html: t.d }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && <div style={{ fontSize: 14.5, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', marginBottom: children != null ? 3 : 0 }}>{title}</div>}
        {children != null && <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
      </div>
      {action != null && <div style={{ flexShrink: 0 }}>{action}</div>}
      {onClose && (
        <button type="button" aria-label="close" onClick={onClose} style={{ flexShrink: 0, display: 'inline-flex', padding: 2, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-semantic-label-assistive)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}
