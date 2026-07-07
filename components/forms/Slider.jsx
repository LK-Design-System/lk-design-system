import React from 'react';

function useSliderStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-slider-css')) return;
    const el = document.createElement('style');
    el.id = 'lk-slider-css';
    el.textContent = `
input.lk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:var(--surface-raised);border:2px solid var(--lk-accent-ink);box-shadow:var(--shadow-control);cursor:pointer;margin-top:0;}
input.lk-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--surface-raised);border:2px solid var(--lk-accent-ink);box-shadow:var(--shadow-control);cursor:pointer;}
input.lk-slider:disabled::-webkit-slider-thumb{border-color:var(--bw-gray-300);cursor:not-allowed;}`;
    document.head.appendChild(el);
  }, []);
}

/**
 * LK ROBOTICS — Slider
 * A range control with a signal-ink filled track and a white knob. Controlled
 * (`value`) or uncontrolled (`defaultValue`); optional trailing `showValue`.
 */
export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, onChange, disabled = false, showValue = false, style, 'aria-label': ariaLabel, ...rest }) {
  useSliderStyles();
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const set = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  const pct = ((val - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...style }}>
      <input
        className="lk-slider"
        type="range"
        aria-label={ariaLabel ?? '값 조절'} min={min} max={max} step={step} value={val} disabled={disabled}
        onChange={(e) => set(Number(e.target.value))}
        style={{
          flex: 1, WebkitAppearance: 'none', appearance: 'none', height: 6, borderRadius: 'var(--radius-pill)', outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: `linear-gradient(to right, var(--lk-accent-ink) 0%, var(--lk-accent-ink) ${pct}%, var(--fill-strong) ${pct}%, var(--fill-strong) 100%)`,
        }}
        {...rest}
      />
      {showValue && <span style={{ minWidth: 36, textAlign: 'right', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 'var(--fw-bold)', color: 'var(--label-neutral)', fontVariantNumeric: 'tabular-nums' }}>{val}</span>}
    </div>
  );
}
