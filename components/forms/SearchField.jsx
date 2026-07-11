import React from 'react';

/**
 * LK ROBOTICS — SearchField
 * A search input with a leading magnifier and a clear affordance. Signal-ink
 * focus ring. Controlled (`value`) or uncontrolled (`defaultValue`); `onSearch`
 * fires on Enter.
 */
export function SearchField({ value, defaultValue, onChange, onSearch, placeholder = '검색', size = 'md', disabled = false, style, 'aria-label': ariaLabel, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || '');
  const [focus, setFocus] = React.useState(false);
  const val = isControlled ? value : internal;
  const set = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  const h = size === 'sm' ? 40 : 50;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, height: h, width: '100%', padding: '0 14px', boxSizing: 'border-box',
      background: 'var(--color-semantic-background-elevated-normal)', border: `1px solid ${focus ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`, borderRadius: 'var(--radius-input)',
      boxShadow: focus ? '0 0 0 4px var(--color-semantic-focus-ring)' : 'none', opacity: disabled ? 0.5 : 1,
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)', ...style,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-label-assistive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      <input
        value={val} disabled={disabled} placeholder={placeholder}
        aria-label={ariaLabel ?? (typeof placeholder === 'string' ? placeholder : '검색')}
        onChange={(e) => set(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onKeyDown={(e) => { if (e.key === 'Enter' && onSearch) onSearch(val); }}
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--color-semantic-label-normal)' }}
        {...rest}
      />
      {val && (
        <button type="button" aria-label="지우기" onClick={() => set('')} style={{ display: 'inline-flex', padding: 2, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-semantic-label-assistive)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" stroke="var(--color-semantic-background-elevated-normal)" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  );
}
