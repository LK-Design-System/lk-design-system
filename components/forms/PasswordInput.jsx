import React from 'react';

/**
 * LK ROBOTICS — PasswordInput
 * A password field with a show/hide toggle. Signal-ink focus ring. Controlled
 * (`value`) or uncontrolled (`defaultValue`).
 */
export function PasswordInput({ value, defaultValue, onChange, placeholder = '비밀번호', size = 'md', disabled = false, style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || '');
  const [show, setShow] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const val = isControlled ? value : internal;
  const set = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  const h = size === 'sm' ? 40 : 50;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: h, width: '100%', padding: '0 12px 0 14px', boxSizing: 'border-box', background: 'var(--bw-white)', border: `1px solid ${focus ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`, borderRadius: 'var(--radius-input)', boxShadow: focus ? '0 0 0 4px var(--focus-ring)' : 'none', opacity: disabled ? 0.5 : 1, transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)', ...style }}>
      <input value={val} disabled={disabled} placeholder={placeholder} type={show ? 'text' : 'password'} onChange={(e) => set(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--label-normal)' }} {...rest} />
      <button type="button" aria-label={show ? 'hide' : 'show'} onClick={() => setShow((s) => !s)} style={{ display: 'inline-flex', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--label-assistive)' }}>
        {show
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18" /><path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" /><path d="M9.4 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a15.9 15.9 0 0 1-3.4 4.3M6.6 6.6A15.8 15.8 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 2.6-.35" /></svg>}
      </button>
    </div>
  );
}
