import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

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
        const bg = done ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-elevated-normal)';
        const bd = done || active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)';
        const fg = done ? 'var(--color-semantic-static-white)' : active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-assistive)';
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: bg, border: `2px solid ${bd}`, color: fg, fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-bold)' }}>
                {done ? <Icon name="check" size={16} aria-hidden="true" /> : (i + 1)}
              </span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0, color: active ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < steps.length - 1 && <span style={{ flex: 1, height: 2, marginTop: 15, background: i < current ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)', minWidth: 24 }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
