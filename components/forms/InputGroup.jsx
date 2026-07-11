import React from 'react';

/**
 * LK ROBOTICS — InputGroup
 * An input flanked by prefix / suffix addons (units, protocols, currency). The
 * addons sit on a soft fill with hairline dividers.
 */
export function InputGroup({ prefix, suffix, value, defaultValue, onChange, placeholder, size = 'md', disabled = false, inputProps, style, 'aria-label': ariaLabel, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || '');
  const val = isControlled ? value : internal;
  const set = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  const h = size === 'sm' ? 40 : 50;
  const Addon = ({ node, side }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 12px', background: 'var(--color-semantic-fill-normal)', color: 'var(--color-semantic-label-alternative)', fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-semibold)', whiteSpace: 'nowrap', [side === 'left' ? 'borderRight' : 'borderLeft']: '1px solid var(--color-semantic-line-solid-normal)' }}>{node}</span>
  );
  return (
    <div style={{ display: 'inline-flex', alignItems: 'stretch', height: h, width: '100%', boxSizing: 'border-box', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-input)', background: 'var(--color-semantic-background-elevated-normal)', overflow: 'hidden', opacity: disabled ? 0.45 : 1, ...style }} {...rest}>
      {prefix != null && <Addon node={prefix} side="left" />}
      <input
        value={val} disabled={disabled} placeholder={placeholder} aria-label={ariaLabel ?? inputProps?.['aria-label'] ?? (typeof placeholder === 'string' ? placeholder : '입력')} onChange={(e) => set(e.target.value)}
        style={{ flex: 1, minWidth: 0, padding: '0 14px', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}
        {...inputProps}
      />
      {suffix != null && <Addon node={suffix} side="right" />}
    </div>
  );
}
