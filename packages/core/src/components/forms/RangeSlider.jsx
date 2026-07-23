import React from 'react';

function useRangeStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-rangeslider-css')) return;
    const el = document.createElement('style');
    el.id = 'lk-rangeslider-css';
    el.textContent = `
input.lk-rangeslider{position:absolute;top:0;left:0;width:100%;height:24px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;pointer-events:none;}
input.lk-rangeslider::-webkit-slider-runnable-track{background:transparent;height:24px;}
input.lk-rangeslider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;pointer-events:auto;width:20px;height:20px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;margin-top:2px;}
input.lk-rangeslider::-moz-range-track{background:transparent;height:24px;}
input.lk-rangeslider::-moz-range-thumb{pointer-events:auto;width:18px;height:18px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;}
input.lk-rangeslider:disabled::-webkit-slider-thumb{border-color:var(--color-semantic-interaction-inactive);cursor:not-allowed;}
input.lk-rangeslider:disabled::-moz-range-thumb{border-color:var(--color-semantic-interaction-inactive);cursor:not-allowed;}`;
    document.head.appendChild(el);
  }, []);
}

/**
 * LK ROBOTICS — RangeSlider
 * A dual-thumb range with a signal-ink fill between the handles. Value is a
 * [low, high] tuple. Controlled or uncontrolled.
 *
 * Each thumb is constrained by the other instead of swapping: the low thumb
 * cannot be dragged past `hi` and the high thumb cannot be dragged below `lo`,
 * so a dragged thumb never changes identity mid-drag (APG / Material / Ant
 * convention). Previously the values were sorted after the fact, which silently
 * handed the pointer to the *other* thumb and made the announced name
 * ("최솟값" / "최댓값") wrong for the handle the user was holding.
 */
export function RangeSlider({
  value,
  defaultValue = [20, 80],
  min = 0,
  max = 100,
  step = 1,
  onChange,
  showValue = false,
  disabled = false,
  label,
  minLabel = '최솟값',
  maxLabel = '최댓값',
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) {
  useRangeStyles();
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [lo, hi] = isControlled ? value : internal;
  // Always re-emit, even when the clamp produced the current tuple: the native
  // input has already moved to the rejected value and React needs a render to
  // pull the DOM back to the controlled value.
  const emit = (next) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  // Each thumb is clamped by the range bound *and* by its sibling; the tuple is
  // never reordered, so the handle under the pointer keeps its identity.
  const setLo = (n) => emit([Math.min(Math.max(n, min), hi), hi]);
  const setHi = (n) => emit([lo, Math.max(Math.min(n, max), lo)]);
  const pctLo = ((lo - min) / (max - min)) * 100;
  const pctHi = ((hi - min) / (max - min)) * 100;
  // When the thumbs sit on top of each other the later input would always win
  // the pointer, making the low thumb ungrabbable. Raise whichever thumb still
  // has room to travel.
  const overlapping = Math.abs(pctHi - pctLo) < 5;
  const loOnTop = overlapping && pctLo >= 50;
  const groupName = label ?? ariaLabel;
  return (
    <div
      role={groupName || ariaLabelledBy ? 'group' : undefined}
      aria-label={groupName || undefined}
      aria-labelledby={ariaLabelledBy}
      aria-disabled={disabled || undefined}
      style={{ opacity: disabled ? 0.45 : 1, ...style }}
      {...rest}
    >
      <div style={{ position: 'relative', height: 24 }}>
        <div style={{ position: 'absolute', top: 9, left: 0, right: 0, height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-strong)' }} />
        <div style={{ position: 'absolute', top: 9, height: 6, borderRadius: 'var(--radius-pill)', background: disabled ? 'var(--color-semantic-interaction-inactive)' : 'var(--color-semantic-primary-normal)', left: `${pctLo}%`, right: `${100 - pctHi}%` }} />
        <input
          className="lk-rangeslider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          disabled={disabled}
          aria-label={groupName ? `${groupName} ${minLabel}` : minLabel}
          style={{ zIndex: loOnTop ? 3 : 2 }}
          onChange={(e) => setLo(Number(e.target.value))}
        />
        <input
          className="lk-rangeslider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          disabled={disabled}
          aria-label={groupName ? `${groupName} ${maxLabel}` : maxLabel}
          style={{ zIndex: loOnTop ? 2 : 3 }}
          onChange={(e) => setHi(Number(e.target.value))}
        />
      </div>
      {showValue && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>
          <span>{lo}</span><span>{hi}</span>
        </div>
      )}
    </div>
  );
}
