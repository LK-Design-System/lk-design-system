import React from 'react';

function toCells(source, length) {
  const characters = Array.from(String(source ?? '')).slice(0, length);
  return Array.from({ length }, (_, index) => characters[index] === ' ' ? '' : characters[index] ?? '');
}

function serializeCells(cells) {
  return cells.map((character) => character || ' ').join('').trimEnd();
}

/**
 * Drop everything the charset does not accept. Whitespace is always removed so
 * a pasted `123 456` still lands one digit per cell.
 */
function sanitize(source, charset) {
  const text = String(source ?? '').replace(/\s+/g, '');
  if (charset === 'any') return text;
  if (charset === 'alphanumeric') return text.replace(/[^0-9a-zA-Z]/g, '');
  return text.replace(/[^0-9]/g, '');
}

/**
 * LK ROBOTICS — PinInput
 * A row of single-character boxes for codes / OTP. Auto-advances on entry,
 * steps back on Backspace, moves with Arrow keys. `mask` hides characters.
 * Controlled (`value`) or uncontrolled; `onComplete` fires when full.
 */
export function PinInput({ length = 6, value, defaultValue = '', onChange, onComplete, mask = false, disabled = false, invalid = false, charset = 'numeric', autoComplete = 'one-time-code', size = 'md', style, 'aria-label': ariaLabel, ...rest }) {
  const normalizedLength = Math.max(1, Math.floor(Number(length) || 1));
  const isControlled = value !== undefined;
  const [cells, setCells] = React.useState(() => toCells(isControlled ? value : defaultValue, normalizedLength));
  const refs = React.useRef([]);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const groupLabel = ariaLabel ?? '인증 코드';
  const inputMode = charset === 'numeric' ? 'numeric' : 'text';

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
  const focusCell = (index) => {
    refs.current[Math.max(0, Math.min(normalizedLength - 1, index))]?.focus();
  };
  /**
   * Spread `text` over the cells starting at `start`. One entry point for
   * typing, pasting and platform autofill (`one-time-code` hands the whole
   * code to a single cell on iOS/Android), so all three fill the row.
   */
  const fill = (start, text) => {
    const chunk = text.slice(0, normalizedLength - start);
    if (!chunk) return;
    const next = [...cells];
    chunk.split('').forEach((character, offset) => { next[start + offset] = character; });
    commit(next);
    focusCell(start + chunk.length);
  };
  const onInput = (i, e) => {
    const raw = String(e.target.value ?? '');
    const previous = cells[i] || '';
    // Retyping over a filled cell arrives as `previous + typed`; keep only the
    // new characters so the cell is replaced instead of shifted.
    const incoming = previous && raw.length > 1 && raw.startsWith(previous) ? raw.slice(previous.length) : raw;
    const accepted = sanitize(incoming, charset);
    if (!accepted) {
      // The controlled value did not change, so React will not re-render this
      // cell — write the rejected character out of the DOM by hand.
      e.target.value = previous;
      if (raw === '' && previous) {
        const cleared = [...cells];
        cleared[i] = '';
        commit(cleared);
      }
      return;
    }
    fill(i, accepted);
  };
  const onKey = (i, e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); focusCell(i - 1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); focusCell(i + 1); return; }
    if (e.key === 'Home') { e.preventDefault(); focusCell(0); return; }
    if (e.key === 'End') { e.preventDefault(); focusCell(normalizedLength - 1); return; }
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
  const cellBorderColor = (i) => {
    if (invalid) return 'var(--component-input-border-color-invalid)';
    if (focusedIndex === i) return 'var(--component-input-border-color-focus)';
    if (cells[i]) return 'var(--color-semantic-primary-normal)';
    return 'var(--component-input-border-color)';
  };
  const boxH = size === 'sm' ? 40 : 48;
  const boxW = size === 'sm' ? 36 : 44;
  return (
    <div {...rest} role="group" aria-label={groupLabel} style={{ display: 'inline-flex', gap: 8, ...style }}>
      {Array.from({ length: normalizedLength }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={cells[i] || ''}
          disabled={disabled}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-label={`${groupLabel} ${i + 1}/${normalizedLength}`}
          aria-invalid={invalid || undefined}
          maxLength={1}
          type={mask ? 'password' : 'text'}
          onChange={(e) => onInput(i, e)}
          onKeyDown={(e) => onKey(i, e)}
          onFocus={() => setFocusedIndex(i)}
          onBlur={() => setFocusedIndex(-1)}
          onPaste={(event) => {
            const pasted = sanitize(event.clipboardData.getData('text'), charset);
            if (!pasted) return;
            event.preventDefault();
            fill(i, pasted);
          }}
          style={{ width: boxW, height: boxH, textAlign: 'center', border: `1px solid ${cellBorderColor(i)}`, borderRadius: 'var(--radius-md)', outline: 'none', boxShadow: focusedIndex === i ? 'var(--component-input-focus-shadow)' : 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-bold)', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)', background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)' }}
        />
      ))}
    </div>
  );
}
