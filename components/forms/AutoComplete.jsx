import React from 'react';

/**
 * LK ROBOTICS — AutoComplete
 * A text input with a filtered suggestion list. Type to filter `options`;
 * click / mousedown a row to select. Controlled (`value`) or uncontrolled.
 * `onSelect` returns the chosen option value.
 */
export function AutoComplete({ options = [], value, defaultValue, onChange, onSelect, placeholder = '입력하세요', size = 'md', style, 'aria-label': ariaLabel, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || '');
  const [open, setOpen] = React.useState(false);
  const val = isControlled ? value : internal;
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const filtered = val ? norm.filter((o) => String(o.label).toLowerCase().includes(String(val).toLowerCase())) : norm;
  const set = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  const pick = (o) => { set(o.label); onSelect && onSelect(o.value); setOpen(false); };
  const h = size === 'sm' ? 40 : 48;
  return (
    <div style={{ position: 'relative', ...style }} {...rest}>
      <input
        value={val} placeholder={placeholder}
        aria-label={ariaLabel ?? (typeof placeholder === 'string' ? placeholder : '입력')}
        onChange={(e) => { set(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        style={{ width: '100%', height: h, padding: '0 16px', boxSizing: 'border-box', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-input)', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--color-semantic-label-normal)', background: 'var(--bw-white)' }}
      />
      {open && filtered.length > 0 && (
        <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30, maxHeight: 240, overflowY: 'auto', background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: 6 }}>
          {filtered.map((o, i) => (
            <div
              key={i} role="option"
              onMouseDown={(e) => { e.preventDefault(); pick(o); }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-semantic-fill-normal)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14.5, color: 'var(--color-semantic-label-normal)' }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
