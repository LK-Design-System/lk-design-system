import React from 'react';

/**
 * LK ROBOTICS — Stepper
 * Numeric +/− control for small quantities (대수, 수량). Cool-gray icon
 * buttons flank a tabular value; clamps to [min, max]. Controlled (`value`)
 * or uncontrolled (`defaultValue`).
 */
export function Stepper({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  size = 'md',
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const set = (next) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };
  const h = size === 'sm' ? 36 : 44;
  const StepBtn = ({ kind }) => {
    const isMinus = kind === 'minus';
    const off = disabled || (isMinus ? val <= min : val >= max);
    return (
      <button
        type="button"
        aria-label={isMinus ? 'decrease' : 'increase'}
        disabled={off}
        onClick={() => set(val + (isMinus ? -step : step))}
        onMouseEnter={(e) => { if (!off) e.currentTarget.style.background = 'var(--color-semantic-fill-normal)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        style={{
          width: h, height: h, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', background: 'transparent', cursor: off ? 'not-allowed' : 'pointer',
          color: off ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)', borderRadius: 'var(--radius-md)',
          transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          {!isMinus && <path d="M12 5v14" />}
        </svg>
      </button>
    );
  };
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', height: h, width: 'fit-content',
        border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)',
        background: 'var(--bw-white)', opacity: disabled ? 0.5 : 1, ...style,
      }}
      {...rest}
    >
      <StepBtn kind="minus" />
      <span
        aria-live="polite"
        style={{
          minWidth: 40, textAlign: 'center', fontFamily: 'var(--font-sans)',
          fontSize: size === 'sm' ? 15 : 16, fontWeight: 'var(--fw-bold)', letterSpacing: 0,
          color: 'var(--color-semantic-label-normal)', fontVariantNumeric: 'tabular-nums',
        }}
      >
        {val}
      </span>
      <StepBtn kind="plus" />
    </div>
  );
}
