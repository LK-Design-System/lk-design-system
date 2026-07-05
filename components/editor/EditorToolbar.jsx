import React from 'react';

/**
 * LK ROBOTICS — EditorToolbar
 * A single-select tool group for canvas editors (select / draw / erase /
 * polygon / pan). `items` are `{ value, icon, label }`; controlled via `value`
 * or uncontrolled via `defaultValue`. The active tool fills with signal ink.
 */
export function EditorToolbar({ items = [], value, defaultValue, onChange, orientation = 'vertical', style, ...rest }) {
  const controlled = value !== undefined;
  const first = items[0] && (items[0].value != null ? items[0].value : items[0]);
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : first);
  const cur = controlled ? value : internal;
  const pick = (v) => { if (!controlled) setInternal(v); onChange && onChange(v); };
  return (
    <div style={{ display: 'inline-flex', flexDirection: orientation === 'vertical' ? 'column' : 'row', gap: 3, ...style }} {...rest}>
      {items.map((it, i) => {
        const v = it.value != null ? it.value : it;
        const on = v === cur;
        return (
          <button key={i} type="button" title={it.label || v} aria-label={it.label || v} aria-pressed={on} onClick={() => pick(v)}
            style={{ width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              background: on ? 'var(--lk-accent-ink)' : 'var(--surface-raised)', color: on ? '#fff' : 'var(--label-neutral)',
              boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--border-subtle)', transition: 'background var(--dur-fast) var(--ease-out)' }}>
            {it.icon || v}
          </button>
        );
      })}
    </div>
  );
}
