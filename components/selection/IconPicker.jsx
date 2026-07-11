import React from 'react';

const sizeMap = {
  sm: { tile: 36, iconBox: 18, radius: 'var(--radius-sm)' },
  md: { tile: 44, iconBox: 20, radius: 'var(--radius-md)' },
  lg: { tile: 52, iconBox: 24, radius: 'var(--radius-lg)' },
};

function optionLabel(option) {
  return option.label || option.value;
}

function normalizeIndex(index, total) {
  return ((index % total) + total) % total;
}

function findEnabledFrom(options, startIndex, direction = 1) {
  if (options.length === 0) return -1;

  let index = normalizeIndex(startIndex, options.length);
  for (let pass = 0; pass < options.length; pass += 1) {
    if (!options[index]?.disabled) return index;
    index = normalizeIndex(index + direction, options.length);
  }

  return -1;
}

function lastEnabledIndex(options) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) return index;
  }
  return -1;
}

/**
 * LDS Product Selection and Input — IconPicker
 * A compact single-select icon tile grid for building, marker, and category icon assignment.
 * It behaves as a radiogroup and supports controlled/uncontrolled selection.
 */
export function IconPicker({
  options = [],
  value,
  defaultValue,
  onChange,
  columns = 6,
  size = 'md',
  label = '아이콘 선택',
  disabled = false,
  emptyLabel = '선택할 아이콘이 없습니다',
  style,
  ...rest
}) {
  const normalizedSize = sizeMap[size] ? size : 'md';
  const { tile, iconBox, radius } = sizeMap[normalizedSize];
  const columnCount = Math.max(1, Number.isFinite(columns) ? Math.trunc(columns) : 6);
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = isControlled ? value : internal;
  const optionRefs = React.useRef([]);
  const selectedIndex = options.findIndex((option) => option.value === current);
  const selectedEnabledIndex = selectedIndex >= 0 && !options[selectedIndex]?.disabled ? selectedIndex : -1;
  const firstEnabledIndex = findEnabledFrom(options, 0);
  const tabStopIndex = selectedEnabledIndex >= 0 ? selectedEnabledIndex : firstEnabledIndex;
  const [focusIndex, setFocusIndex] = React.useState(tabStopIndex);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [hoveredIndex, setHoveredIndex] = React.useState(-1);

  React.useEffect(() => {
    setFocusIndex(tabStopIndex);
  }, [tabStopIndex]);

  const pick = (option) => {
    if (disabled || !option || option.disabled) return;
    if (!isControlled) setInternal(option.value);
    if (onChange) onChange(option.value);
  };

  const focusAndPick = (index) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setFocusIndex(index);
    pick(option);
    window.requestAnimationFrame(() => optionRefs.current[index]?.focus());
  };

  const handleKeyDown = (event, index) => {
    if (disabled || options[index]?.disabled) return;

    const keyMap = {
      ArrowRight: [index + 1, 1],
      ArrowDown: [index + 1, 1],
      ArrowLeft: [index - 1, -1],
      ArrowUp: [index - 1, -1],
    };

    if (keyMap[event.key]) {
      event.preventDefault();
      const [startIndex, direction] = keyMap[event.key];
      focusAndPick(findEnabledFrom(options, startIndex, direction));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusAndPick(firstEnabledIndex);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusAndPick(lastEnabledIndex(options));
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled ? 'true' : undefined}
      style={{
        display: 'grid',
        gridTemplateColumns:
          options.length > 0 ? `repeat(${columnCount}, ${tile}px)` : `minmax(${tile * 3}px, 1fr)`,
        gap: 'var(--space-2)',
        width: 'fit-content',
        maxWidth: '100%',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {options.length === 0 ? (
        <div
          aria-disabled="true"
          style={{
            minHeight: tile,
            display: 'grid',
            placeItems: 'center',
            padding: '0 var(--space-3)',
            border: '1px solid var(--color-semantic-line-normal-normal)',
            borderRadius: radius,
            background: 'var(--color-semantic-fill-normal)',
            color: 'var(--color-semantic-label-assistive)',
            fontSize: 'var(--caption1-size)',
            lineHeight: 'var(--caption1-line)',
            fontWeight: 'var(--fw-medium)',
            letterSpacing: 0,
            boxSizing: 'border-box',
          }}
        >
          {emptyLabel}
        </div>
      ) : (
        options.map((option, index) => {
          const selected = option.value === current;
          const optionDisabled = disabled || !!option.disabled;
          const labelText = optionLabel(option);

          return (
            <button
              key={option.value}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={labelText}
              title={labelText}
              disabled={optionDisabled}
              tabIndex={optionDisabled ? -1 : focusIndex === index || tabStopIndex === index ? 0 : -1}
              data-selected={selected ? '' : undefined}
              onClick={() => pick(option)}
              onFocus={() => {
                if (!optionDisabled) {
                  setFocusIndex(index);
                  setFocusedIndex(index);
                }
              }}
              onBlur={() => setFocusedIndex(-1)}
              onMouseEnter={() => { if (!optionDisabled) setHoveredIndex(index); }}
              onMouseLeave={() => setHoveredIndex(-1)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              style={{
                width: tile,
                height: tile,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                border: `1px solid ${
                  selected && !optionDisabled
                    ? 'var(--color-semantic-primary-normal)'
                    : 'var(--color-semantic-line-normal-normal)'
                }`,
                borderRadius: radius,
                background: optionDisabled
                  ? 'var(--color-semantic-fill-normal)'
                  : selected
                    ? 'var(--color-semantic-primary-surface-strong)'
                    : hoveredIndex === index
                      ? 'var(--color-semantic-fill-normal)'
                      : 'var(--color-semantic-background-elevated-normal)',
                color: optionDisabled
                  ? 'var(--color-semantic-label-disable)'
                  : selected
                    ? 'var(--color-semantic-primary-normal)'
                    : 'var(--color-semantic-label-neutral)',
                cursor: optionDisabled ? 'not-allowed' : 'pointer',
                outline: 'none',
                boxShadow: focusedIndex === index && !optionDisabled ? '0 0 0 4px var(--color-semantic-focus-ring)' : 'none',
                fontFamily: 'var(--font-sans)',
                boxSizing: 'border-box',
                transition:
                  'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: iconBox,
                  height: iconBox,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {option.icon}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}
