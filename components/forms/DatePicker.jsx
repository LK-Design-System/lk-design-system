import React from 'react';
import { Calendar } from '../data/Calendar.jsx';

/**
 * LK ROBOTICS — DatePicker
 * A date field that opens a Calendar popover (composes the `Calendar`
 * component). Controlled (`value`) or uncontrolled (`defaultValue`); closes on
 * outside-click and on selection.
 */
export function DatePicker({ value, defaultValue, onChange, placeholder = '날짜 선택', size = 'md', style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue || null);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  const fmt = (d) => { if (!d) return ''; const dt = d instanceof Date ? d : new Date(d); return `${dt.getFullYear()}. ${String(dt.getMonth() + 1).padStart(2, '0')}. ${String(dt.getDate()).padStart(2, '0')}`; };
  const h = size === 'sm' ? 40 : 50;
  const pick = (d) => { if (!isControlled) setInternal(d); onChange && onChange(d); setOpen(false); };
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', ...style }} {...rest}>
      <button
        type="button" onClick={() => setOpen((o) => !o)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, height: h, padding: '0 14px', minWidth: 200, background: 'var(--bw-white)', border: `1px solid ${open ? 'var(--lk-accent-ink)' : 'var(--bw-border)'}`, borderRadius: 'var(--radius-input)', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, color: sel ? 'var(--label-normal)' : 'var(--label-assistive)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--label-alternative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="17" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></svg>
        <span style={{ flex: 1, textAlign: 'left' }}>{sel ? fmt(sel) : placeholder}</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 40 }}>
          <Calendar value={sel || undefined} onChange={pick} />
        </div>
      )}
    </div>
  );
}
