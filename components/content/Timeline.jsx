import React from 'react';

const DOT = {
  signal: 'var(--color-semantic-primary-normal)',
  positive: 'var(--bw-green)',
  cautionary: 'var(--bw-amber)',
  negative: 'var(--bw-red)',
  neutral: 'var(--bw-gray-300)',
};

/**
 * LK ROBOTICS — Timeline
 * A vertical event timeline (변경 이력, 활동 로그). Each item is a tonal node on a
 * hairline rail, with a time, title and optional description.
 */
export function Timeline({ items = [], style, ...rest }) {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const c = DOT[it.tone] || DOT.signal;
        return (
          <div key={i} style={{ display: 'flex', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '2px solid var(--bw-white)', boxShadow: `0 0 0 1px ${c}`, flexShrink: 0, marginTop: 4 }} />
              {!last && <span style={{ flex: 1, width: 2, background: 'var(--bw-border)', marginTop: 4 }} />}
            </div>
            <div style={{ paddingBottom: last ? 0 : 22 }}>
              {it.time != null && <div style={{ fontSize: 12, fontWeight: 'var(--fw-bold)', letterSpacing: '0.2px', color: 'var(--color-semantic-label-assistive)', marginBottom: 3 }}>{it.time}</div>}
              <div style={{ fontSize: 15.5, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{it.title}</div>
              {it.description != null && <div style={{ marginTop: 3, fontSize: 13.5, lineHeight: 1.6, color: 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all' }}>{it.description}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
