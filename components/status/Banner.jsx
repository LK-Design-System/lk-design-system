import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { statusToneStyle } from './status-presentation.js';

const TONES = {
  info: { tone: 'signal', c: 'var(--component-banner-info-icon)', bg: 'var(--component-banner-info-bg)', border: 'var(--component-banner-info-border)' },
  success: { tone: 'positive', c: 'var(--component-banner-positive-icon)', bg: 'var(--component-banner-positive-bg)', border: 'var(--component-banner-positive-border)' },
  warning: { tone: 'cautionary', c: 'var(--component-banner-cautionary-icon)', bg: 'var(--component-banner-cautionary-bg)', border: 'var(--component-banner-cautionary-border)' },
  error: { tone: 'negative', c: 'var(--component-banner-negative-icon)', bg: 'var(--component-banner-negative-bg)', border: 'var(--component-banner-negative-border)' },
};

// Canonical tone vocabulary (statusToneStyle) normalised onto the legacy
// Banner keys, which remain supported for compatibility.
function normalizeTone(value) {
  if (value === 'signal') return 'info';
  if (value === 'positive') return 'success';
  if (value === 'cautionary') return 'warning';
  if (value === 'negative') return 'error';
  return value || 'info';
}

/**
 * LK ROBOTICS — Banner
 * An inline notice bar — a tinted surface, a tonal leading icon, a message and
 * optional trailing action / close. Calm, hairline-bordered. For a floating
 * transient message use Toast.
 */
export function Banner({ tone = 'info', title, children, action, onClose, closeLabel = '닫기', style, ...rest }) {
  const t = TONES[normalizeTone(tone)] || TONES.info;
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
      <Icon name={statusToneStyle(t.tone).icon} size={20} color={t.c} aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && <div style={{ fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', marginBottom: children != null ? 3 : 0 }}>{title}</div>}
        {children != null && <div style={{ fontSize: 'var(--label1-size)', lineHeight: 1.6, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
      </div>
      {action != null && <div style={{ flexShrink: 0 }}>{action}</div>}
      {onClose && (
        <button type="button" aria-label={closeLabel} onClick={onClose} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 24, minHeight: 24, padding: 4, margin: -3, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-semantic-label-neutral)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
}
