import React from 'react';

const DOT = {
  signal: 'var(--color-semantic-primary-normal)',
  positive: 'var(--color-semantic-status-positive)',
  cautionary: 'var(--color-semantic-status-cautionary)',
  negative: 'var(--color-semantic-status-negative)',
  neutral: 'var(--color-semantic-interaction-inactive)',
};

/** `dateTime` 이 없으면 문자열 `time` 을 기계 판독 값으로 씁니다("09:12", "2026-07-03"). */
function machineTime(item) {
  if (item.dateTime != null) return item.dateTime;
  return typeof item.time === 'string' ? item.time : undefined;
}

/**
 * LK ROBOTICS — Timeline
 * A vertical event timeline (변경 이력, 활동 로그). Each item is a tonal node on a
 * hairline rail, with a time, title and optional description.
 *
 * Accessibility — the chronology is an `ol`/`li` so order and item count survive
 * without sight (WCAG 1.3.1), and each stamp is a `<time dateTime>` element.
 */
export function Timeline({ items = [], label, style, ...rest }) {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <ol aria-label={label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const c = DOT[it.tone] || DOT.signal;
          const dt = machineTime(it);
          const timeStyle = { fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)', letterSpacing: '0.2px', color: 'var(--color-semantic-label-alternative)', marginBottom: 3, display: 'block' };
          return (
            <li key={it.id != null ? it.id : i} style={{ display: 'flex', gap: 14 }}>
              <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '2px solid var(--color-semantic-background-elevated-normal)', boxShadow: `0 0 0 1px ${c}`, flexShrink: 0, marginTop: 4 }} />
                {!last && <span style={{ flex: 1, width: 2, background: 'var(--color-semantic-line-solid-normal)', marginTop: 4 }} />}
              </div>
              <div style={{ paddingBottom: last ? 0 : 22 }}>
                {it.time != null && (
                  dt != null
                    ? <time dateTime={dt} style={timeStyle}>{it.time}</time>
                    : <div style={timeStyle}>{it.time}</div>
                )}
                <div style={{ fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-normal)' }}>{it.title}</div>
                {it.description != null && <div style={{ marginTop: 3, fontSize: 'var(--label2-size)', lineHeight: 1.6, color: 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all' }}>{it.description}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
