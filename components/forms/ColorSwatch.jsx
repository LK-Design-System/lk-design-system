import React from 'react';

/**
 * LK ROBOTICS — ColorSwatch
 * A row of selectable colour swatches (theme / status pickers). The active
 * swatch gets a signal-ink ring. Controlled (`value`) or uncontrolled.
 */
export function ColorSwatch({ colors = [], value, defaultValue, onChange, size = 28, shape = 'rounded', style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const pick = (c) => { if (!isControlled) setInternal(c); onChange && onChange(c); };
  const radius = shape === 'circle' ? '50%' : 'var(--radius-md)';
  return (
    <div style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap', ...style }} {...rest}>
      {colors.map((c) => {
        const on = c === val;
        return (
          <button
            key={c} type="button" aria-label={c} onClick={() => pick(c)}
            style={{ width: size, height: size, borderRadius: radius, background: c, cursor: 'pointer', padding: 0, border: '2px solid var(--bw-white)', boxShadow: on ? '0 0 0 2px var(--lk-accent-ink)' : 'inset 0 0 0 1px rgba(14,19,41,0.12)', transition: 'box-shadow var(--dur-fast) var(--ease-out)' }}
          />
        );
      })}
    </div>
  );
}
