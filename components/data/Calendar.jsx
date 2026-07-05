import React from 'react';

const WD = ['일', '월', '화', '수', '목', '금', '토'];
function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

function DayCell({ d, selected, today, onPick }) {
  const [h, setH] = React.useState(false);
  const dow = d.getDay();
  const bg = selected ? 'var(--lk-accent-ink)' : (h ? 'var(--fill-normal)' : 'transparent');
  const color = selected ? '#fff' : (dow === 0 ? 'var(--bw-red)' : dow === 6 ? 'var(--lk-accent-ink)' : 'var(--label-normal)');
  return (
    <button
      type="button"
      onClick={() => onPick(d)}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        height: 38, borderRadius: 'var(--radius-md)', cursor: 'pointer',
        border: today && !selected ? '1px solid var(--lk-accent-ink)' : '1px solid transparent',
        background: bg, color, fontFamily: 'var(--font-sans)', fontSize: 14,
        fontWeight: selected ? 'var(--fw-bold)' : 'var(--fw-medium)', fontVariantNumeric: 'tabular-nums',
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}
    >
      {d.getDate()}
    </button>
  );
}

/**
 * LK ROBOTICS — Calendar
 * A month grid for date selection (현장 실사 일정). Sunday red / Saturday signal
 * headers; the selected day fills with the signal ink; today carries a ring.
 * Controlled (`value`) or uncontrolled (`defaultValue`). Compose with an Input
 * in a popover to build a date picker.
 */
export function Calendar({ value, defaultValue, onChange, style, ...rest }) {
  const parse = (v) => (v ? (v instanceof Date ? v : new Date(v)) : null);
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(parse(defaultValue));
  const sel = isControlled ? parse(value) : internal;
  const now = new Date();
  const [view, setView] = React.useState(() => (sel ? new Date(sel.getFullYear(), sel.getMonth(), 1) : new Date(now.getFullYear(), now.getMonth(), 1)));
  const todayStr = ymd(now);
  const startDow = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let dd = 1; dd <= days; dd++) cells.push(new Date(view.getFullYear(), view.getMonth(), dd));
  const pick = (d) => { if (!isControlled) setInternal(d); onChange && onChange(d); };
  const navMonth = (delta) => setView(new Date(view.getFullYear(), view.getMonth() + delta, 1));
  const navBtn = { width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', background: 'var(--bw-white)', cursor: 'pointer', color: 'var(--label-neutral)' };
  return (
    <div style={{ width: 300, fontFamily: 'var(--font-sans)', background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-xl)', padding: 16, ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.3px', color: 'var(--label-normal)' }}>{view.getFullYear()}년 {view.getMonth() + 1}월</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button type="button" aria-label="previous month" onClick={() => navMonth(-1)} style={navBtn}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg></button>
          <button type="button" aria-label="next month" onClick={() => navMonth(1)} style={navBtn}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg></button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 6 }}>
        {WD.map((w, i) => <div key={w} style={{ textAlign: 'center', fontSize: 12, fontWeight: 'var(--fw-semibold)', color: i === 0 ? 'var(--bw-red)' : i === 6 ? 'var(--lk-accent-ink)' : 'var(--label-assistive)' }}>{w}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
        {cells.map((d, i) => (d ? <DayCell key={i} d={d} selected={sel && ymd(sel) === ymd(d)} today={todayStr === ymd(d)} onPick={pick} /> : <span key={i} />))}
      </div>
    </div>
  );
}
