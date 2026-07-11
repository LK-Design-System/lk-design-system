import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { statusToneStyle } from './status-presentation.js';

const CT = {
  signal: { fg: 'var(--component-callout-info-icon)', bg: 'var(--component-callout-info-bg)', border: 'var(--component-callout-info-border)' },
  positive: { fg: 'var(--component-callout-positive-icon)', bg: 'var(--component-callout-positive-bg)', border: 'var(--component-callout-positive-border)' },
  cautionary: { fg: 'var(--component-callout-cautionary-icon)', bg: 'var(--component-callout-cautionary-bg)', border: 'var(--component-callout-cautionary-border)' },
  negative: { fg: 'var(--component-callout-negative-icon)', bg: 'var(--component-callout-negative-bg)', border: 'var(--component-callout-negative-border)' },
  navy: { fg: 'var(--component-callout-neutral-icon)', bg: 'var(--component-callout-neutral-bg)', border: 'var(--component-callout-neutral-border)' },
};
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
export function Callout({ tone = 'signal', title, children, icon, style, ...rest }) {
  const normalizedTone = CT[tone] ? tone : 'signal';
  const palette = CT[normalizedTone];
  const c = palette.fg;
  const defaultIcon = <Icon name={statusToneStyle(normalizedTone === 'navy' ? 'offline' : normalizedTone).icon} size={ICON_SIZE} />;
  const normalizedIcon = normalizeIcon(icon, defaultIcon);
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: '16px 18px',
        boxSizing: 'border-box',
        background: palette.bg,
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
          marginTop: 1,
        }}
      >
        {normalizedIcon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && <div style={{ fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', marginBottom: children != null ? 4 : 0 }}>{title}</div>}
        {children != null && <div style={{ fontSize: 'var(--label1-size)', lineHeight: 1.65, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
      </div>
    </div>
  );
}
