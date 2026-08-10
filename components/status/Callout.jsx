import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { useResolvedDensity } from '../internal/component-density.js';
import { normalizeStatusTone, statusToneStyle } from './status-presentation.js';

// Status surface colors come straight from the semantic status tier via
// statusToneStyle (the former --component-callout-* aliases were removed).
const ICON_SIZE = 20;

function normalizeIcon(icon, fallbackIcon) {
  if (!React.isValidElement(icon)) return fallbackIcon;
  return React.cloneElement(icon, {
    size: icon.props.size ?? ICON_SIZE,
    width: icon.props.width ?? ICON_SIZE,
    height: icon.props.height ?? ICON_SIZE,
    style: { display: 'block', ...icon.props.style },
  });
}

/**
 * LK ROBOTICS — Callout
 * An emphasized note block with a tonal icon, soft surface, and tonal hairline.
 * Heavier than Banner — for guidance, tips, and important standing notes in body
 * content.
 */
export function Callout({ tone = 'signal', title, headingLevel = false, children, icon, density, style, ...rest }) {
  const resolvedDensity = useResolvedDensity(density, 'comfortable');
  const compact = resolvedDensity === 'compact';
  const navy = tone === 'navy';
  const normalizedTone = navy ? 'offline' : normalizeStatusTone(tone);
  const palette = navy
    ? {
        icon: 'circle-info',
        foreground: 'var(--color-semantic-brand-on-surface)',
        surface: 'var(--color-semantic-brand-surface)',
        border: 'var(--color-semantic-brand-on-surface-border)',
      }
    : statusToneStyle(normalizedTone);
  const c = palette.foreground;
  const defaultIcon = <Icon name={palette.icon} size={ICON_SIZE} />;
  const normalizedIcon = normalizeIcon(icon, defaultIcon);
  const Heading = headingLevel ? `h${headingLevel}` : 'div';
  return (
    <div
      data-density={resolvedDensity}
      style={{
        display: 'flex',
        gap: compact ? 'var(--space-3)' : 'var(--space-3-5)',
        padding: compact ? 'var(--space-3) var(--space-4)' : '16px 18px',
        boxSizing: 'border-box',
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'none',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: c,
          lineHeight: 0,
          flexShrink: 0,
          marginTop: 'var(--space-0-5)',
        }}
      >
        {normalizedIcon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && <Heading style={{ margin: 0, fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: navy ? 'var(--color-semantic-brand-on-surface)' : 'var(--color-semantic-label-normal)', marginBottom: children != null ? 4 : 0 }}>{title}</Heading>}
        {children != null && <div style={{ fontSize: 'var(--label1-size)', lineHeight: compact ? 'var(--label1-line)' : 1.65, color: navy ? 'var(--color-semantic-brand-on-surface-subtle)' : 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
      </div>
    </div>
  );
}
