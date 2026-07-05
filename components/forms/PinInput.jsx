import React from 'react';

/**
 * LK ROBOTICS — PinInput
 * A row of single-character boxes for codes / OTP. Auto-advances on entry,
 * steps back on Backspace. `mask` hides characters. Controlled (`value`) or
 * uncontrolled; `onComplete` fires when full.
 */
export function PinInput({ length = 6, value, defaultValue = '', onChange, onComplete, mask = false, disabled = false, size = 'md', style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const raw = (isControlled ? value : internal) || '';
  const refs = React.useRef([]);
  const commit = (next) => { const v = next.slice(0, length); if (!isControlled) setInternal(v); onChange && onChange(v); if (v.length === length && onComplete) onComplete(v); };
  const onInput = (i, e) => {
    const c = e.target.value.slice(-1);
    const arr = raw.split('');
    arr[i] = c;
    commit(arr.join('').slice(0, length));
    if (c && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => { if (e.key === 'Backspace' && !raw[i] && refs.current[i - 1]) refs.current[i - 1].focus(); };
  const boxH = size === 'sm' ? 40 : 48;
  const boxW = size === 'sm' ? 36 : 44;
  return (
    <div style={{ display: 'inline-flex', gap: 8, ...style }} {...rest}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={raw[i] || ''}
          disabled={disabled}
          inputMode="numeric"
          maxLength={1}
          type={mask ? 'password' : 'text'}
          onChange={(e) => onInput(i, e)}
          onKeyDown={(e) => onKey(i, e)}
          style={{ width: boxW, height: boxH, textAlign: 'center', border: `1px solid ${raw[i] ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`, borderRadius: 'var(--radius-md)', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 'var(--fw-bold)', color: 'var(--label-normal)', background: 'var(--bw-white)' }}
        />
      ))}
    </div>
  );
}
