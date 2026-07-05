import React from 'react';

function pad(n) { return String(n).padStart(2, '0'); }

/** Compact custom dropdown for a numeric field (hour / minute) — no native <select>. */
function TimeDropdown({ value, options, onChange, height, ariaLabel }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height, padding: '0 12px', boxSizing: 'border-box', background: 'var(--bw-white)', border: `1px solid ${open ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`, borderRadius: 'var(--radius-md)', boxShadow: open ? '0 0 0 4px var(--focus-ring)' : 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 'var(--fw-semibold)', color: 'var(--label-normal)', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)' }}
      >
        {pad(value)}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--label-alternative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: '100%', zIndex: 40, maxHeight: 220, overflowY: 'auto', background: 'var(--surface-overlay)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {options.map((x) => {
            const on = x === value;
            return (
              <div
                key={x} role="option" aria-selected={on}
                onClick={() => { onChange(x); setOpen(false); }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--fill-normal)'; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                style={{ padding: '7px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14.5, textAlign: 'center', color: on ? 'var(--lk-accent-ink)' : 'var(--label-normal)', background: on ? 'var(--lk-accent-tint-2)' : 'transparent', fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)' }}
              >
                {pad(x)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * LK ROBOTICS — TimePicker
 * Hour + minute custom dropdowns (24h), matching Select's styled trigger + panel
 * (signal focus, highlighted selection) — no native <select>. Value is an
 * "HH:MM" string; `minuteStep` controls the minute options. Controlled or not.
 */
export function TimePicker({ value, defaultValue = '09:00', onChange, minuteStep = 5, size = 'md', style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const v = isControlled ? value : internal;
  const [h, m] = (v || '00:00').split(':').map(Number);
  const set = (nh, nm) => { const nv = `${pad(nh)}:${pad(nm)}`; if (!isControlled) setInternal(nv); onChange && onChange(nv); };
  const height = size === 'sm' ? 40 : 50;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const mins = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...style }} {...rest}>
      <TimeDropdown value={h} options={hours} onChange={(nh) => set(nh, m)} height={height} ariaLabel="hour" />
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', color: 'var(--label-alternative)' }}>:</span>
      <TimeDropdown value={m} options={mins} onChange={(nm) => set(h, nm)} height={height} ariaLabel="minute" />
    </div>
  );
}
