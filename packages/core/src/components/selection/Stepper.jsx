import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — Stepper
 * Numeric +/− control for small quantities (대수, 수량). Cool-gray icon
 * buttons flank a tabular value; clamps to [min, max]. Controlled (`value`)
 * or uncontrolled (`defaultValue`).
 *
 * Accessibility — the value is an APG `role="spinbutton"` (not a roleless
 * `<span aria-live>`): it is focusable, exposes `aria-valuenow/min/max/text`,
 * and owns the ArrowUp/ArrowDown/PageUp/PageDown/Home/End contract. The
 * wrapper is a labelled `role="group"` and the two icon buttons get contextual
 * Korean names derived from `label`. At the bounds the buttons stay focusable
 * with `aria-disabled` instead of flipping to native `disabled`, which would
 * drop keyboard focus to `<body>`. Press-and-hold auto-repeats.
 *
 * See Stepper.prompt.md ("접근성 계약") for the pattern decision and sources.
 */
export function Stepper({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  largeStep,
  onChange,
  size = 'md',
  disabled = false,
  label,
  decrementLabel,
  incrementLabel,
  valueText,
  repeatDelay = 400,
  repeatInterval = 80,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const valRef = React.useRef(val);
  valRef.current = val;

  const commit = (next) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped === valRef.current) return;
    valRef.current = clamped;
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };
  const stepBy = (delta) => commit(valRef.current + delta);

  // ── press-and-hold auto-repeat (iOS Stepper / Ant InputNumber convention) ──
  const repeat = React.useRef({ delay: null, tick: null });
  const stopRepeat = React.useCallback(() => {
    clearTimeout(repeat.current.delay);
    clearInterval(repeat.current.tick);
    repeat.current.delay = null;
    repeat.current.tick = null;
  }, []);
  React.useEffect(() => stopRepeat, [stopRepeat]);
  React.useEffect(() => { if (disabled) stopRepeat(); }, [disabled, stopRepeat]);

  const startRepeat = (delta, isBlocked) => {
    stopRepeat();
    repeat.current.delay = setTimeout(() => {
      repeat.current.tick = setInterval(() => {
        if (isBlocked()) { stopRepeat(); return; }
        stepBy(delta);
      }, repeatInterval);
    }, repeatDelay);
  };

  const groupName = label ?? ariaLabel ?? '수량';
  const nameForButtons = typeof groupName === 'string' ? groupName : '수량';
  const h = size === 'sm' ? 36 : 44;
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);

  // Rendered as a plain function (not a nested component) so the buttons are
  // reconciled instead of remounted on every value change — a remount would
  // drop DOM focus and swallow the click that follows pointerdown.
  const pointerActivated = React.useRef(false);
  const renderStepBtn = (kind) => {
    const isMinus = kind === 'minus';
    const atBound = isMinus ? val <= min : val >= max;
    const off = disabled || atBound;
    const delta = isMinus ? -step : step;
    const blocked = () => (isMinus ? valRef.current <= min : valRef.current >= max);
    const activate = () => { if (off) return; stepBy(delta); };
    return (
      <button
        key={kind}
        type="button"
        // aria-disabled keeps the button in the tab order at the bounds, so a
        // keyboard user does not lose focus to <body> when the limit is hit.
        aria-disabled={off || undefined}
        aria-label={(isMinus ? decrementLabel : incrementLabel)
          ?? `${nameForButtons} ${isMinus ? '감소' : '증가'}`}
        onPointerDown={(e) => {
          if (e.button !== 0 || off) return;
          pointerActivated.current = true;
          activate();
          startRepeat(delta, blocked);
        }}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={() => { pointerActivated.current = false; stopRepeat(); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') pointerActivated.current = false; }}
        onBlur={stopRepeat}
        onClick={() => {
          // The pointer path already stepped on pointerdown; only keyboard
          // (Enter/Space) activation reaches this branch.
          if (pointerActivated.current) { pointerActivated.current = false; return; }
          activate();
        }}
        onMouseEnter={(e) => { if (!off) e.currentTarget.style.background = 'var(--color-semantic-fill-normal)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        style={{
          width: h, height: h, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'transparent', cursor: off ? 'not-allowed' : 'pointer',
          color: off ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)', borderRadius: 'var(--radius-md)',
          transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        }}
      >
        <Icon name={isMinus ? 'minus' : 'plus'} size={18} aria-hidden="true" />
      </button>
    );
  };

  const [valueFocused, setValueFocused] = React.useState(false);
  const page = largeStep ?? step * 10;

  const handleValueKeyDown = (event) => {
    if (disabled) return;
    switch (event.key) {
      case 'ArrowUp': event.preventDefault(); stepBy(step); break;
      case 'ArrowDown': event.preventDefault(); stepBy(-step); break;
      case 'PageUp': event.preventDefault(); stepBy(page); break;
      case 'PageDown': event.preventDefault(); stepBy(-page); break;
      case 'Home': if (hasMin) { event.preventDefault(); commit(min); } break;
      case 'End': if (hasMax) { event.preventDefault(); commit(max); } break;
      default: break;
    }
  };

  return (
    <div
      role="group"
      aria-label={typeof groupName === 'string' && !ariaLabelledBy ? groupName : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled || undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', height: h, width: 'fit-content',
        border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)',
        background: 'var(--color-semantic-background-elevated-normal)', opacity: disabled ? 0.45 : 1, ...style,
      }}
      {...rest}
    >
      {renderStepBtn('minus')}
      <span
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={typeof groupName === 'string' && !ariaLabelledBy ? groupName : undefined}
        aria-labelledby={ariaLabelledBy}
        aria-valuenow={val}
        aria-valuemin={hasMin ? min : undefined}
        aria-valuemax={hasMax ? max : undefined}
        aria-valuetext={valueText ? valueText(val) : undefined}
        aria-disabled={disabled || undefined}
        // While the spinbutton itself holds focus the value change is announced
        // through aria-valuenow, so the live region would double-speak it. It is
        // only active when the +/− buttons (or the pointer) drive the change.
        aria-live={valueFocused ? 'off' : 'polite'}
        onKeyDown={handleValueKeyDown}
        onFocus={() => setValueFocused(true)}
        onBlur={() => setValueFocused(false)}
        style={{
          minWidth: 40, textAlign: 'center', fontFamily: 'var(--font-sans)',
          fontSize: size === 'sm' ? 15 : 16, fontWeight: 'var(--fw-bold)', letterSpacing: 0,
          color: 'var(--color-semantic-label-normal)', fontVariantNumeric: 'tabular-nums',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        {val}
      </span>
      {renderStepBtn('plus')}
    </div>
  );
}
