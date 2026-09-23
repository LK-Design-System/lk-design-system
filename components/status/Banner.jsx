import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { normalizeStatusTone, statusToneStyle } from './status-presentation.js';

const BANNER_STYLES = `
@container lds-banner (max-width: 400px) {
  .lk-banner__content {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .lk-banner__action {
    justify-self: start;
  }
}
`;

// Status surface colors come straight from the semantic status tier via
// statusToneStyle (the former --component-banner-* aliases were removed).
function variantStyle(variant, palette) {
  if (variant === 'embedded') {
    return {
      padding: 'var(--space-3) var(--space-5)',
      background: palette.surface,
      border: 'none',
      borderRadius: 0,
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
export function Banner({ tone = 'signal', variant = 'standalone', title, children, action, onClose, closeLabel = '닫기', className, style, ...rest }) {
  const normalizedTone = normalizeStatusTone(tone);
  const t = statusToneStyle(normalizedTone);
  const urgent = normalizedTone === 'negative';
  const resolvedVariant = variant === 'embedded' ? 'embedded' : 'standalone';
  return (
    <div
      role={urgent ? 'alert' : 'status'}
      aria-live={urgent ? 'assertive' : 'polite'}
      data-slot="root"
      data-banner-variant={resolvedVariant}
      className={['lk-banner', className].filter(Boolean).join(' ')}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box',
        containerType: 'inline-size',
        containerName: 'lds-banner',
        background: t.surface,
        ...variantStyle(resolvedVariant, t),
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <style>{BANNER_STYLES}</style>
      <Icon data-slot="icon" className="lk-banner__icon" name={t.icon} size={20} color={t.foreground} aria-hidden="true" style={{ flexShrink: 0, marginTop: 'var(--space-0-5)' }} />
      <div
        data-slot="content"
        className="lk-banner__content"
        style={{
          display: 'grid',
          gridTemplateColumns: action != null ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
          alignItems: 'start',
          gap: 'var(--space-2) var(--space-3)',
          flex: 1,
          minWidth: 0,
        }}
      >
        <div data-slot="message" className="lk-banner__message" style={{ minWidth: 0 }}>
          {title != null && <div data-slot="title" className="lk-banner__title" style={{ fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', marginBottom: children != null ? 3 : 0 }}>{title}</div>}
          {children != null && <div data-slot="body" className="lk-banner__body" style={{ fontSize: 'var(--label1-size)', lineHeight: 1.6, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
        </div>
        {action != null && (
          <div
            data-slot="action"
            className="lk-banner__action"
            style={{ minWidth: 0, maxWidth: '100%', color: t.foreground, overflowWrap: 'anywhere' }}
          >
            {action}
          </div>
        )}
      </div>
      {onClose && (
        <button data-slot="close" className="lk-banner__close" type="button" aria-label={closeLabel} onClick={onClose} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 24, minHeight: 24, padding: 4, margin: -3, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-semantic-label-neutral)' }}>
          <Icon name="close" size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
