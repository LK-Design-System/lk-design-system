import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function defaultValueText(value, max) {
  return `${max}점 만점에 ${value}점`;
}

/**
 * LK ROBOTICS — Rating
 * A star rating in the muted ochre. Two distinct modes, because a display value
 * and an input are different things to assistive tech:
 *
 * - `readOnly` (표시) — one `role="img"` whose accessible name *is* the value
 *   ("5점 만점에 4점"). The glyphs stay `aria-hidden`; nothing is focusable.
 * - interactive (입력) — an APG `role="slider"` with a single tab stop,
 *   `aria-valuemin/max/now` and a Korean `aria-valuetext`. Arrow keys move by
 *   one star, Home/End jump to the bounds. This mirrors `Stepper`'s
 *   `role="spinbutton"` decision: a range value belongs on one focusable
 *   element with a value contract, not on a set of roleless `<span onClick>`s.
 *   A radiogroup of 5 stars would also mean five ~20px tap targets, well under
 *   the 24×24 target-size floor the system ratchets.
 *
 * Fill is integer-only: there is no half-star glyph, so a fractional `value`
 * fills `Math.floor(value)` stars while the announced value keeps its precision.
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function Rating({
  value,
  defaultValue = 0,
  max = 5,
  onChange,
  size = 20,
  readOnly = false,
  label = '평점',
  valueText,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState(null);
  const raw = isControlled ? value : internal;
  const val = clamp(Number(raw) || 0, 0, max);
  const shown = hover != null ? hover : val;
  const text = (valueText || defaultValueText)(val, max);

  const commit = (next) => {
    if (readOnly) return;
    const clamped = clamp(next, 0, max);
    if (clamped === val) return;
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };

  const handleKeyDown = (event) => {
    if (event.defaultPrevented) return;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        commit(val + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        commit(val - 1);
        break;
      case 'Home':
        event.preventDefault();
        commit(0);
        break;
      case 'End':
        event.preventDefault();
        commit(max);
        break;
      default:
        break;
    }
  };

  const stars = Array.from({ length: max }).map((_, i) => {
    const filled = i < Math.floor(shown);
    return (
      <span
        key={i}
        aria-hidden="true"
        onMouseEnter={() => { if (!readOnly) setHover(i + 1); }}
        onMouseLeave={() => { if (!readOnly) setHover(null); }}
        onClick={() => commit(i + 1)}
        style={{ display: 'inline-flex', cursor: readOnly ? 'default' : 'pointer', color: filled ? 'var(--color-semantic-accent-foreground-orange)' : 'var(--color-semantic-interaction-inactive)' }}
      >
        <Icon name={filled ? 'star-fill' : 'star'} size={size} aria-hidden="true" />
      </span>
    );
  });

  if (readOnly) {
    return (
      <span
        role="img"
        aria-label={ariaLabelledBy ? undefined : (ariaLabel || text)}
        aria-labelledby={ariaLabelledBy}
        data-rating-value={val}
        style={{ display: 'inline-flex', gap: 'var(--space-0-5)', ...style }}
        {...rest}
      >
        {stars}
      </span>
    );
  }

  return (
    <span
      role="slider"
      tabIndex={0}
      aria-label={ariaLabelledBy ? undefined : (ariaLabel || label)}
      aria-labelledby={ariaLabelledBy}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={val}
      aria-valuetext={text}
      data-rating-value={val}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHover(null)}
      style={{ display: 'inline-flex', gap: 'var(--space-0-5)', ...style }}
      {...rest}
    >
      {stars}
    </span>
  );
}
