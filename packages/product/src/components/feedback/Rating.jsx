import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

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
            style={{ display: 'inline-flex', cursor: readOnly ? 'default' : 'pointer', color: filled ? 'var(--color-semantic-accent-foreground-orange)' : 'var(--color-semantic-interaction-inactive)' }}
          >
            <Icon name={filled ? 'star-fill' : 'star'} size={size} aria-hidden="true" />
          </span>
        );
      })}
    </span>
  );
}
