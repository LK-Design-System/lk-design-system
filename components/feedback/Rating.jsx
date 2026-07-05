import React from 'react';

/**
 * LK ROBOTICS — Rating
 * A star rating in the muted ochre. Interactive (hover preview + click) or
 * `readOnly` for display. Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function Rating({ value, defaultValue = 0, max = 5, onChange, size = 20, readOnly = false, style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState(null);
  const val = isControlled ? value : internal;
  const shown = hover != null ? hover : val;
  const set = (v) => { if (readOnly) return; if (!isControlled) setInternal(v); onChange && onChange(v); };
  return (
    <span style={{ display: 'inline-flex', gap: 2, ...style }} {...rest}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < shown;
        return (
          <span
            key={i}
            onMouseEnter={() => { if (!readOnly) setHover(i + 1); }}
            onMouseLeave={() => { if (!readOnly) setHover(null); }}
            onClick={() => set(i + 1)}
            style={{ display: 'inline-flex', cursor: readOnly ? 'default' : 'pointer', color: filled ? 'var(--bw-amber)' : 'var(--bw-gray-300)' }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 18.6 6.2 21l1.1-6.5-4.7-4.6 6.5-.95z" /></svg>
          </span>
        );
      })}
    </span>
  );
}
