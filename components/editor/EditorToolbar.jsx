import React from 'react';

/**
 * LK ROBOTICS — EditorToolbar
 * A single-select tool group for canvas editors (select / draw / erase /
 * polygon / pan). `items` are `{ value, icon, label }`; controlled via `value`
 * or uncontrolled via `defaultValue`. The active tool fills with signal ink.
 */
export function EditorToolbar({ items = [], value, defaultValue, onChange, orientation = 'vertical', label = '편집 도구', disabled = false, style, ...rest }) {
  const controlled = value !== undefined;
  const first = items[0] && (items[0].value != null ? items[0].value : items[0]);
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : first);
  const buttonRefs = React.useRef([]);
  const cur = controlled ? value : internal;
  const activeEnabledIndex = items.findIndex((item) => {
    const itemValue = item.value != null ? item.value : item;
    return itemValue === cur && !disabled && !item.disabled;
  });
  const firstEnabledIndex = items.findIndex((item) => !disabled && !item.disabled);
  const pick = (v, itemDisabled) => {
    if (disabled || itemDisabled) return;
    if (!controlled) setInternal(v);
    onChange && onChange(v);
  };
  const moveFocus = (currentIndex, direction) => {
    const enabled = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !disabled && !item.disabled);
    if (enabled.length === 0) return;
    const currentEnabledIndex = enabled.findIndex(({ index }) => index === currentIndex);
    const startIndex = currentEnabledIndex === -1 ? 0 : currentEnabledIndex;
    const next = enabled[(startIndex + direction + enabled.length) % enabled.length];
    buttonRefs.current[next.index]?.focus();
  };
  const focusBoundary = (boundary) => {
    const enabled = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !disabled && !item.disabled);
    const target = boundary === 'start' ? enabled[0] : enabled[enabled.length - 1];
    if (target) buttonRefs.current[target.index]?.focus();
  };
  return (
    <div role="toolbar" aria-label={label} aria-orientation={orientation} style={{ display: 'inline-flex', flexDirection: orientation === 'vertical' ? 'column' : 'row', gap: 3, ...style }} {...rest}>
      {items.map((it, i) => {
        const v = it.value != null ? it.value : it;
        const on = v === cur;
        const itemDisabled = disabled || !!it.disabled;
        return (
          <button
            key={v}
            ref={(node) => { buttonRefs.current[i] = node; }}
            type="button"
            title={it.label || v}
            aria-label={it.label || v}
            aria-pressed={on}
            tabIndex={(on && !itemDisabled) || (activeEnabledIndex === -1 && i === firstEnabledIndex) ? 0 : -1}
            disabled={itemDisabled}
            onClick={() => pick(v, itemDisabled)}
            onKeyDown={(event) => {
              const previousKeys = orientation === 'vertical' ? ['ArrowUp'] : ['ArrowLeft'];
              const nextKeys = orientation === 'vertical' ? ['ArrowDown'] : ['ArrowRight'];
              if (previousKeys.includes(event.key)) {
                event.preventDefault();
                moveFocus(i, -1);
              }
              if (nextKeys.includes(event.key)) {
                event.preventDefault();
                moveFocus(i, 1);
              }
              if (event.key === 'Home') {
                event.preventDefault();
                focusBoundary('start');
              }
              if (event.key === 'End') {
                event.preventDefault();
                focusBoundary('end');
              }
            }}
            style={{ width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 'var(--radius-sm)',
              background: on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-elevated-normal)', color: on ? 'var(--color-semantic-static-white)' : 'var(--color-semantic-label-neutral)',
              boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--color-semantic-line-normal-normal)', opacity: itemDisabled ? 0.42 : 1, cursor: itemDisabled ? 'not-allowed' : 'pointer', transition: 'background var(--dur-fast) var(--ease-out)' }}>
            {it.icon || v}
          </button>
        );
      })}
    </div>
  );
}
