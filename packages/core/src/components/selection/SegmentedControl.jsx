import React from 'react';

function normalizeSegmentOption(option) {
  return typeof option === 'string'
    ? { value: option, label: option, disabled: false }
    : {
        ...option,
        disabled: Boolean(option.disabled || option.disable || option.interaction === 'inactive'),
      };
}

/** Compact, mutually exclusive view or mode selection. */
export function SegmentedControl({
  options = [],
  value,
  defaultValue,
  onChange,
  variant = 'solid',
  size = 'md',
  interaction,
  full = false,
  resize,
  disabled = false,
  disable = false,
  style,
  'aria-label': ariaLabel = '보기 선택',
  ...groupProps
}) {
  const normalizedOptions = options.map(normalizeSegmentOption);
  const enabledIndices = normalizedOptions
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0);
  const fallbackValue = defaultValue ?? normalizedOptions[enabledIndices[0]]?.value;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(fallbackValue);
  const currentValue = isControlled ? value : internalValue;
  const disabledState = disabled || disable || interaction === 'inactive';
  const buttonRefs = React.useRef([]);
  const normalizedSize = size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size;
  const height = normalizedSize === 'sm' ? 32 : normalizedSize === 'lg' ? 48 : 40;
  const fontSize = normalizedSize === 'sm' ? 'var(--label1-size)' : normalizedSize === 'lg' ? 'var(--headline2-size)' : 'var(--body1-size)';
  const trackRadius = normalizedSize === 'sm' ? 'var(--radius-8)' : normalizedSize === 'lg' ? 'var(--radius-md)' : 'var(--radius-10)';
  const segmentRadius = normalizedSize === 'sm' ? 'var(--radius-sm)' : normalizedSize === 'lg' ? 'var(--radius-10)' : 'var(--radius-8)';
  const trackPadding = normalizedSize === 'lg' ? 3 : 2;
  const outlined = variant === 'outlined';
  const fill = full || resize === 'fill';
  const selectedIndex = normalizedOptions.findIndex((option) => option.value === currentValue && !option.disabled);
  const rovingIndex = selectedIndex >= 0 ? selectedIndex : (enabledIndices[0] ?? -1);

  const pick = (index, { focus = false } = {}) => {
    const option = normalizedOptions[index];
    if (!option || disabledState || option.disabled) return;
    if (option.value !== currentValue) {
      if (!isControlled) setInternalValue(option.value);
      onChange?.(option.value);
    }
    if (focus) buttonRefs.current[index]?.focus();
  };

  const move = (currentIndex, direction) => {
    if (!enabledIndices.length) return;
    const currentEnabledIndex = enabledIndices.indexOf(currentIndex);
    const base = currentEnabledIndex >= 0 ? currentEnabledIndex : 0;
    const next = (base + direction + enabledIndices.length) % enabledIndices.length;
    pick(enabledIndices[next], { focus: true });
  };

  return (
    <div
      {...groupProps}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabledState || undefined}
      style={{
        display: 'inline-flex',
        width: fill ? '100%' : undefined,
        height,
        boxSizing: 'border-box',
        justifySelf: fill ? undefined : 'start',
        padding: outlined ? 0 : trackPadding,
        gap: outlined ? 0 : 2,
        background: outlined ? 'var(--color-semantic-background-elevated-normal)' : 'var(--color-semantic-fill-normal)',
        border: outlined ? '1px solid var(--color-semantic-line-solid-normal)' : 'none',
        borderRadius: trackRadius,
        overflow: 'hidden',
        ...style,
      }}
    >
      {normalizedOptions.map((option, index) => {
        const optionInteraction = option.interaction || interaction;
        const selected = option.value === currentValue;
        const optionDisabled = disabledState || option.disabled;
        const active = selected || optionInteraction === 'active' || optionInteraction === 'active-focused';
        const activeHover = !optionDisabled && optionInteraction === 'hovered';
        const activeFocus = !optionDisabled && (optionInteraction === 'focused' || optionInteraction === 'active-focused');
        return (
          <button
            key={option.value}
            ref={(node) => { buttonRefs.current[index] = node; }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={optionDisabled || undefined}
            data-selected={selected ? 'true' : 'false'}
            data-disabled={optionDisabled ? 'true' : 'false'}
            tabIndex={!optionDisabled && index === rovingIndex ? 0 : -1}
            disabled={optionDisabled}
            onClick={() => pick(index)}
            onKeyDown={(event) => {
              if (event.defaultPrevented || optionDisabled) return;
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                move(index, -1);
              } else if (event.key === 'Home') {
                event.preventDefault();
                pick(enabledIndices[0], { focus: true });
              } else if (event.key === 'End') {
                event.preventDefault();
                pick(enabledIndices[enabledIndices.length - 1], { focus: true });
              }
            }}
            style={{
              flex: fill ? 1 : undefined,
              height: '100%',
              minHeight: 0,
              boxSizing: 'border-box',
              padding: '0 9px',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: optionDisabled ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize,
              fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-medium)',
              letterSpacing: 0,
              color: optionDisabled
                ? 'var(--color-semantic-label-disable)'
                : active
                  ? 'var(--color-semantic-label-normal)'
                  : activeFocus
                    ? 'var(--color-semantic-label-normal)'
                    : 'var(--color-semantic-label-neutral)',
              background: optionDisabled
                ? active
                  ? 'var(--color-semantic-fill-strong)'
                  : 'transparent'
                : active
                  ? (outlined ? 'var(--color-semantic-primary-surface-strong)' : 'var(--color-semantic-background-elevated-normal)')
                  : activeHover || activeFocus
                    ? 'var(--color-semantic-fill-normal)'
                    : 'transparent',
              borderRadius: outlined ? 0 : segmentRadius,
              borderLeft: outlined && index > 0 ? '1px solid var(--color-semantic-line-solid-normal)' : 'none',
              boxShadow: [
                active && !outlined && !optionDisabled ? 'var(--shadow-xs)' : null,
                activeFocus ? '0 0 0 4px var(--color-semantic-focus-ring)' : null,
              ].filter(Boolean).join(', ') || 'none',
              transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
              whiteSpace: 'nowrap',
            }}
          >
            {option.icon && <span aria-hidden="true" style={{ display: 'inline-flex', flex: '0 0 auto' }}>{option.icon}</span>}
            <span>{option.label}</span>
            {option.count != null && (
              <span
                data-segment-count="true"
                style={{
                  minWidth: '1.25em',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 'var(--fw-bold)',
                  color: active ? 'currentColor' : 'var(--color-semantic-label-alternative)',
                }}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
