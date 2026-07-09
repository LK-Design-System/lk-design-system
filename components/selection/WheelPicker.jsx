import React from 'react';

/**
 * LK ROBOTICS — WheelPicker
 * iOS-style drum / wheel selector — a scroll-snap column with a highlighted
 * centre row; items fade and shrink with distance from centre. Click a row or
 * scroll to pick. Options are strings or {value, label}. Controlled (`value`)
 * or uncontrolled (`defaultValue`).
 */
export function WheelPicker({ options = [], value, defaultValue, onChange, itemHeight = 36, visible = 5, style, ...rest }) {
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: String(o) }));
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (opts[0] && opts[0].value));
  const cur = controlled ? value : internal;
  const ref = React.useRef(null);
  const idx = Math.max(0, opts.findIndex((o) => o.value === cur));
  const pad = Math.floor(visible / 2);

  React.useEffect(() => {
    if (ref.current) ref.current.scrollTop = idx * itemHeight;
  }, [idx, itemHeight]);

  const pick = (v) => { if (!controlled) setInternal(v); onChange && onChange(v); };

  const onScroll = () => {
    if (!ref.current) return;
    const i = Math.round(ref.current.scrollTop / itemHeight);
    const o = opts[Math.max(0, Math.min(opts.length - 1, i))];
    if (o && o.value !== cur) pick(o.value);
  };

  return (
    <div style={{ position: 'relative', width: 120, height: itemHeight * visible, overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-elevated-normal)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: pad * itemHeight, height: itemHeight, borderTop: '1px solid var(--color-semantic-line-normal-normal)', borderBottom: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--lk-accent-tint)', pointerEvents: 'none' }} />
      <ul ref={ref} role="listbox" aria-label="휠 선택" onScroll={onScroll}
        style={{ listStyle: 'none', margin: 0, padding: `${pad * itemHeight}px 0`, height: '100%', overflowY: 'auto', scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}>
        {opts.map((o, i) => {
          const dist = Math.abs(i - idx);
          const sel = o.value === cur;
          return (
            <li key={o.value} role="option" aria-selected={sel} onClick={() => pick(o.value)}
              style={{ height: itemHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', scrollSnapAlign: 'center', cursor: 'pointer',
                fontSize: sel ? 16 : 14, fontWeight: sel ? 'var(--fw-bold)' : 'var(--fw-medium)',
                color: sel ? 'var(--color-semantic-label-strong)' : 'var(--color-semantic-label-alternative)',
                opacity: Math.max(0.25, 1 - dist * 0.28), transform: `scale(${Math.max(0.82, 1 - dist * 0.06)})`, transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)' }}>
              {o.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
