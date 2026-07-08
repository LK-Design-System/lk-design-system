import React from 'react';

const CT = { signal: 'var(--color-semantic-primary-normal)', positive: 'var(--bw-green)', cautionary: 'var(--bw-amber)', negative: 'var(--bw-red)', navy: 'var(--bw-ink)' };
const ICON_SIZE = 20;

function normalizeIcon(icon) {
  if (!React.isValidElement(icon)) return icon;
  return React.cloneElement(icon, {
    size: icon.props.size ?? ICON_SIZE,
    width: icon.props.width ?? ICON_SIZE,
    height: icon.props.height ?? ICON_SIZE,
    style: { display: 'block', ...icon.props.style },
  });
}

/**
 * LK ROBOTICS — Callout
 * An emphasized note block with a tonal icon, soft tint, and outline.
 * Heavier than Banner — for guidance, tips, and important standing notes in body
 * content.
 */
export function Callout({ tone = 'signal', title, children, icon, style, ...rest }) {
  const c = CT[tone] || CT.signal;
  const normalizedIcon = normalizeIcon(icon);
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        padding: '16px 18px',
        background: `color-mix(in srgb, ${c} 7%, var(--color-semantic-background-elevated-normal))`,
        border: `1px solid color-mix(in srgb, ${c} 32%, var(--color-semantic-line-normal-normal))`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: `inset 0 1px 0 color-mix(in srgb, ${c} 12%, transparent)`,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <span
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
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && <div style={{ fontSize: 15, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)', marginBottom: children != null ? 4 : 0 }}>{title}</div>}
        {children != null && <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{children}</div>}
      </div>
    </div>
  );
}
