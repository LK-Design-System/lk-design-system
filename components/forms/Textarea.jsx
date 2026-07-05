import React from 'react';

/**
 * LK ROBOTICS — Textarea
 * Multi-line field matching Input's box, ring and focus halo. Vertically
 * resizable, min 120px.
 */
export function Textarea({
  label,
  required = false,
  invalid = false,
  rows = 5,
  id,
  style,
  ...rest
}) {
  const taId = id || (label ? `ta-${String(label).replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const [focused, setFocused] = React.useState(false);
  const ring = invalid ? 'var(--bw-red)' : focused ? 'var(--lk-accent-ink)' : 'var(--bw-border)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
      {label && (
        <label htmlFor={taId} style={{ fontWeight: 'var(--fw-bold)', fontSize: '15px', letterSpacing: 0, color: 'var(--bw-ink)' }}>
          {label}{required && <span style={{ color: 'var(--bw-red)' }}> *</span>}
        </label>
      )}
      <textarea
        id={taId}
        rows={rows}
        {...rest}
        onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
        style={{
          width: '100%', resize: 'vertical', minHeight: 120, padding: '14px 18px',
          background: 'var(--bw-white)', color: 'var(--bw-ink)',
          border: `1px solid ${ring}`, borderRadius: 'var(--radius-input)',
          boxShadow: focused && !invalid ? '0 0 0 4px var(--focus-ring)' : 'none',
          transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
          fontFamily: 'var(--font-sans)', fontSize: '15px', letterSpacing: 0, lineHeight: 1.6,
          outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
