import React from 'react';

/**
 * LK ROBOTICS — Steps
 * A horizontal process indicator (도입 절차, 설치 단계). Completed steps fill with
 * the signal ink + check; the current step is ringed; upcoming steps are muted.
 * `steps` are strings or `{ label }`; `current` is the active index.
 */
export function Steps({ steps = [], current = 0, style, ...rest }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', ...style }} {...rest}>
      {steps.map((s, i) => {
        const label = typeof s === 'string' ? s : s.label;
        const done = i < current;
        const active = i === current;
        const bg = done ? 'var(--lk-accent-ink)' : 'var(--bw-white)';
        const bd = done || active ? 'var(--lk-accent-ink)' : 'var(--bw-border)';
        const fg = done ? '#fff' : active ? 'var(--lk-accent-ink)' : 'var(--label-assistive)';
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: bg, border: `2px solid ${bd}`, color: fg, fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 'var(--fw-bold)' }}>
                {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> : (i + 1)}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: '-0.1px', color: active ? 'var(--label-normal)' : 'var(--label-alternative)', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < steps.length - 1 && <span style={{ flex: 1, height: 2, marginTop: 15, background: i < current ? 'var(--lk-accent-ink)' : 'var(--bw-border)', minWidth: 24 }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
