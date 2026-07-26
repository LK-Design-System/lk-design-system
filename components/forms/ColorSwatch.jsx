import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/* 문자열 색과 {value,label,disabled} 항목을 같은 계약으로 다룬다. label이 없으면
   원시 CSS 값을 접근 가능 이름으로 쓰지 않고 한국어 위치 이름으로 대체한다. */
function normalizeSwatch(color, index) {
  const option = typeof color === 'string' || typeof color === 'number' ? { value: String(color) } : { ...color };
  return {
    value: option.value,
    label: option.label ?? `색상 ${index + 1}`,
    disabled: Boolean(option.disabled),
  };
}

/**
 * LK ROBOTICS — ColorSwatch
 * A single-select row of colour swatches (theme / status pickers) built as an
 * APG radio group: one roving Tab stop, Arrow/Home/End selection, `aria-checked`
 * per swatch, and a check mark so the selection is not colour-only (WCAG 1.4.1).
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function ColorSwatch({
  colors = [],
  value,
  defaultValue,
  onChange,
  size = 28,
  shape = 'rounded',
  label = '색상 선택',
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const val = isControlled ? value : internal;
  const swatchRefs = React.useRef([]);
  const swatches = colors.map(normalizeSwatch);
  const enabledIndices = swatches.map((swatch, index) => (swatch.disabled ? -1 : index)).filter((index) => index >= 0);
  const selectedIndex = swatches.findIndex((swatch) => swatch.value === val && !swatch.disabled);
  /* APG Radio Group: 선택 위치 하나로만 roving tabindex를 계산해 그룹의 Tab stop을 항상 1개로 유지한다. */
  const rovingIndex = selectedIndex >= 0 ? selectedIndex : (enabledIndices[0] ?? -1);
  const radius = shape === 'circle' ? '50%' : 'var(--radius-md)';
  const markSize = Math.max(12, Math.round(size / 2));

  const pick = (index, { focus = false } = {}) => {
    const swatch = swatches[index];
    if (!swatch || disabled || swatch.disabled) return;
    if (!isControlled) setInternal(swatch.value);
    onChange && onChange(swatch.value);
    if (focus) swatchRefs.current[index]?.focus();
  };

  const move = (index, direction) => {
    if (enabledIndices.length === 0) return;
    const position = enabledIndices.indexOf(index);
    const base = position >= 0 ? position : 0;
    pick(enabledIndices[(base + direction + enabledIndices.length) % enabledIndices.length], { focus: true });
  };

  const handleKeyDown = (event, index) => {
    if (disabled || swatches[index]?.disabled) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      move(index, 1);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      move(index, -1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      pick(enabledIndices[0], { focus: true });
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      pick(enabledIndices[enabledIndices.length - 1], { focus: true });
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      style={{ display: 'inline-flex', gap: 'var(--space-2-5)', flexWrap: 'wrap', ...style }}
      {...rest}
    >
      {swatches.map((swatch, index) => {
        const on = swatch.value === val;
        const swatchDisabled = disabled || swatch.disabled;
        const showFocusRing = focusedIndex === index && !swatchDisabled;
        return (
          <button
            key={swatch.value}
            ref={(node) => { swatchRefs.current[index] = node; }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={swatch.label}
            title={swatch.label}
            disabled={swatchDisabled}
            tabIndex={swatchDisabled ? -1 : index === rovingIndex ? 0 : -1}
            data-selected={on ? '' : undefined}
            onClick={() => pick(index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            style={{
              width: size,
              height: size,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius,
              background: swatch.value,
              cursor: swatchDisabled ? 'not-allowed' : 'pointer',
              opacity: swatchDisabled ? 0.4 : 1,
              padding: 0,
              outline: 'none',
              border: '2px solid var(--color-semantic-background-elevated-normal)',
              boxShadow: [
                on ? '0 0 0 2px var(--color-semantic-primary-normal)' : 'inset 0 0 0 1px var(--color-semantic-line-normal-normal)',
                showFocusRing ? '0 0 0 4px var(--color-semantic-focus-ring)' : null,
              ].filter(Boolean).join(', '),
              transition: 'box-shadow var(--dur-fast) var(--ease-out)',
            }}
          >
            {/* 선택을 색상 링만으로 표현하지 않도록 체크 표시를 함께 그린다(WCAG 1.4.1).
                임의의 색 위에서도 읽히게 흰 체크에 어두운 halo를 덧입힌다. */}
            {on && (
              <Icon
                name="check"
                size={markSize}
                color="var(--color-semantic-static-white)"
                aria-hidden="true"
                style={{ filter: 'drop-shadow(0 0 1px var(--color-semantic-static-black)) drop-shadow(0 0 2px var(--color-semantic-static-black))' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
