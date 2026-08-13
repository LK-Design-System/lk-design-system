import React from 'react';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';

/* 화면에는 보이지 않고 스크린 리더에만 읽히는 상태 텍스트용 스타일. */
const srOnly = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0,
};

/**
 * LK ROBOTICS — Steps
 * A horizontal process indicator (도입 절차, 설치 단계). Completed steps fill with
 * the signal ink + check; the current step is ringed; upcoming steps are muted.
 * `steps` are strings or `{ label }`; `current` is the active index.
 * Renders an ordered list (`<ol>`/`<li>`); the current step carries
 * `aria-current="step"` and every step appends a visually-hidden state suffix
 * (완료 · 현재 단계 · 예정) for assistive tech.
 * `labelPolicy` decides which labels stay visible on narrow surfaces:
 * 'always' (default) · 'current-only' · 'none'. A visually hidden label is
 * still rendered sr-only so the accessible name never changes with policy.
 */
export function Steps({ steps = [], current = 0, labelPolicy = 'always', style, ...rest }) {
  return (
    <ol style={{ display: 'flex', alignItems: 'flex-start', listStyle: 'none', margin: 0, padding: 0, ...style }} {...rest}>
      {steps.map((s, i) => {
        const label = typeof s === 'string' ? s : s.label;
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        const bg = done ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-elevated-normal)';
        const bd = done || active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)';
        const fg = done ? 'var(--color-semantic-static-white)' : active ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-alternative)';
        const labelVisible = labelPolicy === 'always' || (labelPolicy === 'current-only' && active);
        return (
          <li key={i} aria-current={active ? 'step' : undefined} style={{ display: 'flex', alignItems: 'flex-start', flex: last ? '0 0 auto' : '1 1 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: bg, border: `2px solid ${bd}`, color: fg, fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-bold)' }}>
                {done ? <Icon name="check" size={16} aria-hidden="true" /> : (i + 1)}
              </span>
              <span style={labelVisible ? { fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0, color: active ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)', whiteSpace: 'nowrap' } : srOnly}>
                {label}
                <span style={srOnly}>{done ? ' 완료' : active ? ' 현재 단계' : ' 예정'}</span>
              </span>
            </div>
            {!last && <span aria-hidden="true" style={{ flex: 1, height: 2, marginTop: 'var(--space-4)', background: i < current ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)', minWidth: 24 }} />}
          </li>
        );
      })}
    </ol>
  );
}
