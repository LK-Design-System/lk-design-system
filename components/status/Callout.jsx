import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { useResolvedDensity } from '../internal/component-density.js';
import { normalizeStatusTone, statusToneStyle } from './status-presentation.js';

// Status surface colors come straight from the semantic status tier via
// statusToneStyle (the former --component-callout-* aliases were removed).
const ICON_SIZE = 24;

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
 * An emphasized note block with a tonal icon and soft, borderless surface.
 * For guidance, tips, and important standing notes in body content.
 *
 * Deliberately outranks Banner in the same tone: block padding instead of bar
 * padding, the panel corner radius, a 24px tonal icon, and a body1 title. Banner
 * is a message bar read once; Callout is a titled block that holds a share of the
 * reading column. The two used to differ by 2px, which made them look
 * interchangeable — the rank is now asserted in StatusFeedback.stories.jsx.
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
        gap: compact ? 'var(--space-3)' : 'var(--space-4)',
        padding: compact ? 'var(--space-3) var(--space-4)' : 'var(--space-5) var(--space-6)',
        boxSizing: 'border-box',
        background: palette.surface,
        border: 'none',
        borderRadius: 'var(--radius-xl)',
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
        }}
      >
        {normalizedIcon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && <Heading style={{ margin: 0, fontSize: 'var(--body1-size)', lineHeight: 'var(--body1-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: navy ? 'var(--color-semantic-brand-on-surface)' : 'var(--color-semantic-label-normal)', marginBottom: children != null ? 'var(--space-1-5)' : 0 }}>{title}</Heading>}
        {children != null && <div style={{ fontSize: 'var(--label1-size)', lineHeight: compact ? 'var(--label1-line)' : 'var(--label1-reading-line)', color: navy ? 'var(--color-semantic-brand-on-surface-subtle)' : 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
      </div>
    </div>
  );
}
