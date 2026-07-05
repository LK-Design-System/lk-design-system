import React from 'react';

/**
 * LK ROBOTICS — Divider
 * A hairline rule on the cool-gray line token. Horizontal by default; pass
 * `vertical` for an inline separator, or `label` for a centered "or"-style
 * divider (핵심 기능 사이 구분).
 */
export function Divider({ vertical = false, label, inset = 0, style, ...rest }) {
  if (vertical) {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        style={{ display: 'inline-block', width: 1, alignSelf: 'stretch', minHeight: 16, background: 'var(--line-neutral)', ...style }}
        {...rest}
      />
    );
  }
  if (label != null) {
    const rule = { flex: 1, height: 1, background: 'var(--line-neutral)' };
    return (
      <div role="separator" style={{ display: 'flex', alignItems: 'center', gap: 14, ...style }} {...rest}>
        <span style={rule} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 'var(--fw-semibold)', letterSpacing: 0, color: 'var(--label-alternative)', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={rule} />
      </div>
    );
  }
  return <hr role="separator" style={{ border: 'none', height: 1, background: 'var(--line-neutral)', margin: `0 ${inset}px`, ...style }} {...rest} />;
}
