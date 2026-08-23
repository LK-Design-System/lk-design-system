import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { embeddedBandStyle, normalizeStatusTone, statusToneStyle } from './status-presentation.js';

// Status surface colors come straight from the semantic status tier via
// statusToneStyle (the former --component-banner-* aliases were removed).
function variantStyle(variant, palette) {
  if (variant === 'embedded') {
    return {
      padding: 'var(--space-3) var(--space-5)',
      ...embeddedBandStyle(palette),
    };
  }
  return {
    padding: '14px 16px',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
  };
}

/**
 * LDS Core — Banner
 * An inline notice bar — a tinted surface, a tonal leading icon, a message and
 * optional trailing action / close. Calm and borderless. For a floating
 * transient message use Toast.
 */
export function Banner({ tone = 'signal', variant = 'standalone', title, children, action, onClose, closeLabel = '닫기', style, ...rest }) {
  const normalizedTone = normalizeStatusTone(tone);
  const t = statusToneStyle(normalizedTone);
  const urgent = normalizedTone === 'negative';
  const resolvedVariant = variant === 'embedded' ? 'embedded' : 'standalone';
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      aria-live={urgent ? 'assertive' : 'polite'}
      data-banner-variant={resolvedVariant}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, boxSizing: 'border-box',
        background: t.surface,
        ...variantStyle(resolvedVariant, t),
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={t.icon} size={20} color={t.foreground} aria-hidden="true" style={{ flexShrink: 0, marginTop: 'var(--space-0-5)' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && <div style={{ fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', marginBottom: children != null ? 3 : 0 }}>{title}</div>}
        {children != null && <div style={{ fontSize: 'var(--label1-size)', lineHeight: 1.6, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
      </div>
      {action != null && <div style={{ flexShrink: 0 }}>{action}</div>}
      {onClose && (
        <button type="button" aria-label={closeLabel} onClick={onClose} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 24, minHeight: 24, padding: 4, margin: -3, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-semantic-label-neutral)' }}>
          <Icon name="close" size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
