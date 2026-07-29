import React from 'react';

/**
 * LDS Product — FloorSelector
 * A compact floor / level picker (building navigation). Single-select list of
 * floors; the active floor fills with the signal ink. Exposed as an ARIA radio
 * group — floor choice is conventionally single-select, so radio semantics
 * match the behaviour exactly: one tab stop, arrow keys rove focus + selection,
 * Home/End jump to the ends. (The previous role="listbox" declared a keyboard
 * model the component never implemented.)
 *
 * `appearance="dark"` is required when the picker sits on a Viewer surface. The
 * default light fill and neutral label ink drop to ~1.3:1 over the viewer's dark
 * canvas, so the dark appearance switches to the shared viewer surface/foreground
 * tokens instead of tinting the light ones.
 */
const APPEARANCE = {
  light: {
    // 채움만으로는 흰 배경에서 1.1:1이라 컨트롤 경계가 사라지고 라벨만 떠 보인다.
    // 헤어라인이 세그먼트 컨트롤이라는 그룹 어피던스를 만든다.
    panel: 'var(--color-semantic-fill-normal)',
    panelBorder: 'var(--border-thin) solid var(--color-semantic-line-normal-normal)',
    idle: 'var(--color-semantic-label-neutral)',
  },
  dark: {
    panel: 'var(--component-viewer-surface-elevated)',
    panelBorder: 'var(--border-thin) solid var(--component-viewer-border)',
    idle: 'var(--component-viewer-muted)',
  },
};

// `sm` is the default because this picker's home is a viewer control stack,
// where it shares a column with ViewerToolbar's 28px buttons — at 44px it reads
// as a different, heavier control bolted onto the same rail. `md` stays for the
// standalone case: a 44px target for a pointer that has the whole panel to aim
// at, meeting WCAG 2.5.5 (AAA). `sm` still clears 2.5.8 (AA, 24×24).
const SIZE = {
  md: { item: 44, gap: 2, pad: 4, font: 'var(--label1-size)' },
  sm: { item: 28, gap: 2, pad: 3, font: 'var(--caption1-size)' },
};

export function FloorSelector({ floors = [], value, defaultValue, onChange, appearance = 'light', size = 'sm', style, ...rest }) {
  const skin = APPEARANCE[appearance] ?? APPEARANCE.light;
  const dim = SIZE[size] ?? SIZE.md;
  const controlled = value !== undefined;
  const norm = floors.map((f) => (typeof f === 'string' ? { value: f, label: f } : f));
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (norm[0] && norm[0].value));
  const cur = controlled ? value : internal;
  const pick = (v) => { if (!controlled) setInternal(v); onChange && onChange(v); };

  // Roving tab stop: the checked floor is the group's single Tab stop; if the
  // current value is not among the floors, the first floor is focusable instead
  // (APG radio group). Every other radio is pulled out of the Tab sequence, so
  // the whole group is one stop rather than one-per-floor.
  const values = norm.map((f) => f.value);
  const selectedIndex = values.indexOf(cur);
  const tabStopIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const focusRadio = (container, index) => {
    const radios = container.querySelectorAll('[role="radio"]');
    const target = radios[index];
    if (!target) return;
    pick(target.getAttribute('data-value'));
    target.focus();
  };

  const handleKeyDown = (event) => {
    const count = norm.length;
    if (count === 0) return;
    const container = event.currentTarget;
    const radios = Array.from(container.querySelectorAll('[role="radio"]'));
    const currentIndex = radios.indexOf(event.target.closest('[role="radio"]'));
    if (currentIndex < 0) return;
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (currentIndex + 1) % count;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (currentIndex - 1 + count) % count;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    else return;
    event.preventDefault();
    focusRadio(container, next);
  };

  return (
    <div role="radiogroup" aria-label="층 선택" data-floor-selector-size={size} onKeyDown={handleKeyDown} style={{ display: 'inline-flex', flexDirection: 'column', gap: dim.gap, padding: dim.pad,
      background: skin.panel, border: skin.panelBorder, borderRadius: 'var(--radius-md)', boxShadow: 'none', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {norm.map((f, index) => {
        const on = f.value === cur;
        return (
          <button key={f.value} type="button" role="radio" aria-checked={on} data-value={f.value}
            tabIndex={index === tabStopIndex ? 0 : -1} onClick={() => pick(f.value)}
            style={{ minWidth: dim.item, height: dim.item, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 'var(--radius-8)', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: dim.font, fontWeight: on ? 'var(--fw-semibold)' : 'var(--fw-medium)', background: on ? 'var(--color-semantic-primary-normal)' : 'transparent', color: on ? 'var(--color-semantic-static-white)' : skin.idle,
              transition: 'background var(--dur-fast) var(--ease-out)' }}>
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
