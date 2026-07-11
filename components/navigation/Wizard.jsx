import React from 'react';

/**
 * LK ROBOTICS — Wizard
 * A multi-step flow: a Steps indicator on top, step content in the middle, and
 * back/next controls. `children` may be a node or a render fn `(current) => …`.
 * Controlled (`current`) or uncontrolled (`defaultCurrent`).
 */
export function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, children, footer, style, ...rest }) {
  const isControlled = current !== undefined;
  const [internal, setInternal] = React.useState(defaultCurrent);
  const cur = isControlled ? current : internal;
  const go = (n) => { const c = Math.max(0, Math.min(steps.length - 1, n)); if (!isControlled) setInternal(c); onStepChange && onStepChange(c); };
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 28 }}>
        {steps.map((s, i) => {
          const label = typeof s === 'string' ? s : s.label;
          const done = i < cur; const active = i === cur;
          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: done ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-elevated-normal)', border: `2px solid ${done || active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`, color: done ? 'var(--color-semantic-static-white)' : active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-assistive)', fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-bold)' }}>
                  {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg> : (i + 1)}
                </span>
                <span style={{ fontSize: 'var(--label2-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', color: active ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
              {i < steps.length - 1 && <span style={{ flex: 1, height: 2, marginTop: 15, background: i < cur ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)', minWidth: 24 }} />}
            </React.Fragment>
          );
        })}
      </div>
      <div>{typeof children === 'function' ? children(cur) : children}</div>
      {footer !== null && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button type="button" onClick={() => go(cur - 1)} disabled={cur === 0} style={{ height: 44, padding: '0 18px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-normal)', cursor: cur === 0 ? 'not-allowed' : 'pointer', opacity: cur === 0 ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)' }}>이전</button>
          <button type="button" onClick={() => go(cur + 1)} disabled={cur === steps.length - 1} style={{ height: 44, padding: '0 20px', border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-primary-normal)', color: 'var(--color-semantic-static-white)', cursor: cur === steps.length - 1 ? 'not-allowed' : 'pointer', opacity: cur === steps.length - 1 ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)' }}>다음</button>
        </div>
      )}
    </div>
  );
}
