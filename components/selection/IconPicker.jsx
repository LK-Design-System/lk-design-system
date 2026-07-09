import React from 'react';

/**
 * LK ROBOTICS — IconPicker
 * Grid of selectable icon tiles (building/marker/category icon assignment).
 * Each option is {value, icon, label}; the picked tile fills with the accent
 * wash and a primary ring. Controlled (`value`) or uncontrolled
 * (`defaultValue`).
 */
export function IconPicker({ options = [], value, defaultValue, onChange, columns = 6, style, ...rest }) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const cur = controlled ? value : internal;
  const pick = (v) => { if (!controlled) setInternal(v); onChange && onChange(v); };

  return (
    <div role="radiogroup" aria-label="아이콘 선택"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 44px)`, gap: 'var(--space-2)', width: 'fit-content', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {options.map((o) => {
        const on = o.value === cur;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} aria-label={o.label || o.value} title={o.label || o.value}
            onClick={() => pick(o.value)}
            style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'inherit',
              border: on ? '1.5px solid var(--color-semantic-primary-normal)' : '1px solid var(--bw-border)',
              background: on ? 'var(--lk-accent-tint)' : 'var(--bw-white)',
              color: on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-neutral)',
              transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)' }}>
            {o.icon}
          </button>
        );
      })}
    </div>
  );
}
