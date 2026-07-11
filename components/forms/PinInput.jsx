import React from 'react';

function toCells(source, length) {
  const characters = Array.from(String(source ?? '')).slice(0, length);
  return Array.from({ length }, (_, index) => characters[index] === ' ' ? '' : characters[index] ?? '');
}

function serializeCells(cells) {
  return cells.map((character) => character || ' ').join('').trimEnd();
}

/**
 * LK ROBOTICS — PinInput
 * A row of single-character boxes for codes / OTP. Auto-advances on entry,
 * steps back on Backspace. `mask` hides characters. Controlled (`value`) or
 * uncontrolled; `onComplete` fires when full.
 */
export function PinInput({ length = 6, value, defaultValue = '', onChange, onComplete, mask = false, disabled = false, size = 'md', style, 'aria-label': ariaLabel, ...rest }) {
  const normalizedLength = Math.max(1, Math.floor(Number(length) || 1));
  const isControlled = value !== undefined;
  const [cells, setCells] = React.useState(() => toCells(isControlled ? value : defaultValue, normalizedLength));
  const refs = React.useRef([]);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  React.useEffect(() => {
    setCells((current) => {
      if (isControlled) return toCells(value, normalizedLength);
      return Array.from({ length: normalizedLength }, (_, index) => current[index] ?? '');
    });
  }, [isControlled, normalizedLength, value]);

  const commit = (next) => {
    const normalized = Array.from({ length: normalizedLength }, (_, index) => next[index] ?? '');
    const serialized = serializeCells(normalized);
    if (!isControlled) setCells(normalized);
    onChange?.(serialized);
    if (normalized.every(Boolean)) onComplete?.(normalized.join(''));
  };
  const onInput = (i, e) => {
    const c = e.target.value.slice(-1);
    const arr = [...cells];
    arr[i] = c;
    commit(arr);
    if (c && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key !== 'Backspace' && e.key !== 'Delete') return;
    e.preventDefault();
    const next = [...cells];
    if (e.key === 'Backspace' && !next[i] && i > 0) {
      next[i - 1] = '';
      commit(next);
      refs.current[i - 1]?.focus();
      return;
    }
    next[i] = '';
    commit(next);
  };
  const boxH = size === 'sm' ? 40 : 48;
  const boxW = size === 'sm' ? 36 : 44;
  return (
    <div {...rest} role="group" aria-label={ariaLabel ?? 'PIN'} style={{ display: 'inline-flex', gap: 8, ...style }}>
      {Array.from({ length: normalizedLength }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={cells[i] || ''}
          disabled={disabled}
          inputMode="numeric"
          aria-label={`${ariaLabel ?? 'PIN'} ${i + 1}`}
          maxLength={1}
          type={mask ? 'password' : 'text'}
          onChange={(e) => onInput(i, e)}
          onKeyDown={(e) => onKey(i, e)}
          onFocus={() => setFocusedIndex(i)}
          onBlur={() => setFocusedIndex(-1)}
          onPaste={(event) => {
            const pasted = event.clipboardData.getData('text').replace(/\s+/g, '').slice(0, normalizedLength - i);
            if (!pasted) return;
            event.preventDefault();
            const next = [...cells];
            pasted.split('').forEach((character, offset) => { next[i + offset] = character; });
            commit(next);
            refs.current[Math.min(normalizedLength - 1, i + pasted.length)]?.focus();
          }}
          style={{ width: boxW, height: boxH, textAlign: 'center', border: `1px solid ${focusedIndex === i ? 'var(--component-input-border-color-focus)' : cells[i] ? 'var(--color-semantic-primary-normal)' : 'var(--component-input-border-color)'}`, borderRadius: 'var(--radius-md)', outline: 'none', boxShadow: focusedIndex === i ? 'var(--component-input-focus-shadow)' : 'none', fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 'var(--fw-bold)', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)', background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)' }}
        />
      ))}
    </div>
  );
}
