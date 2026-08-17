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
 * Type resolves through `--lk-timeline-*` re-point hooks whose fallbacks ARE
 * the product ramp values, so a product screen renders byte-identically while
 * a medium that reads farther away (a projection surface, a satellite)
 * re-points the hooks in its own scope instead of hand-rolling the rail
 * (the same contract Table cells carry, docs/TIMELINE_ORIENTATION_PROPOSAL.md).
 * Rank, not size, is what the medium re-points: a timeline's stamp stays
 * quieter than its title in every medium.
 */
const TIME_TYPE = {
  fontSize: 'var(--lk-timeline-time-size, var(--caption1-size))',
  lineHeight: 'var(--lk-timeline-time-line, normal)',
  fontWeight: 'var(--fw-bold)',
  letterSpacing: 'var(--lk-timeline-time-spacing, 0.2px)',
  color: 'var(--color-semantic-label-alternative)',
  display: 'block',
};
const TITLE_TYPE = {
  fontSize: 'var(--lk-timeline-title-size, var(--body2-size))',
  lineHeight: 'var(--lk-timeline-title-line, normal)',
  fontWeight: 'var(--fw-bold)',
  letterSpacing: 'var(--lk-timeline-title-spacing, 0)',
  color: 'var(--color-semantic-label-normal)',
};
const DESC_TYPE = {
  marginTop: 'var(--space-1)',
  fontSize: 'var(--lk-timeline-desc-size, var(--label2-size))',
  lineHeight: 'var(--lk-timeline-desc-line, 1.6)',
  letterSpacing: 'var(--lk-timeline-desc-spacing, normal)',
  color: 'var(--color-semantic-label-alternative)',
  wordBreak: 'keep-all',
};

/**
 * LK ROBOTICS — Timeline
 * An event timeline (변경 이력, 활동 로그). Each item is a tonal node on a
 * hairline rail, with a time, title and optional description.
 *
 * `orientation` — 'vertical' (default) reads a log top-down; 'horizontal'
 * reads a chronology left-to-right, each event an equal column
 * (`minmax(0, 1fr)`: fewer events, wider columns). The rail segment stops
 * before the last node — the chronology ends there, and a line running on
 * claims otherwise. Requested by the slide medium, where a vertical rail is
 * a document idiom (docs/TIMELINE_ORIENTATION_PROPOSAL.md); dashboards with
 * few milestones read the same way.
 *
 * Accessibility — the chronology is an `ol`/`li` so order and item count survive
 * without sight (WCAG 1.3.1), and each stamp is a `<time dateTime>` element.
 * Orientation is presentation only: the list semantics are identical.
 */
export function Timeline({ items = [], label, orientation = 'vertical', style, ...rest }) {
  if (orientation === 'horizontal') {
    return (
      <div style={{ fontFamily: 'var(--font-sans)', ...style }} data-orientation="horizontal" {...rest}>
        <ol
          aria-label={label}
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(0, 1fr)',
            gap: 'var(--space-6)',
          }}
        >
          {items.map((it, i) => {
            const last = i === items.length - 1;
            const c = DOT[it.tone] || DOT.signal;
            const dt = machineTime(it);
            const timeStyle = { ...TIME_TYPE, margin: 'var(--space-2) 0 var(--space-1)' };
            return (
              <li key={it.id != null ? it.id : i} style={{ minWidth: 0 }}>
                <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '2px solid var(--color-semantic-background-elevated-normal)', boxShadow: `0 0 0 1px ${c}`, flexShrink: 0 }} />
                  {/* The segment bridges the grid gap to the next node — a
                      rail interrupted at every gap reads as many timelines. */}
                  {!last && <span style={{ flex: 1, height: 2, background: 'var(--color-semantic-line-solid-normal)', marginLeft: 4, marginRight: 'calc(var(--space-6) * -1)' }} />}
                </div>
                {it.time != null && (
                  dt != null
                    ? <time dateTime={dt} style={timeStyle}>{it.time}</time>
                    : <div style={timeStyle}>{it.time}</div>
                )}
                <div style={TITLE_TYPE}>{it.title}</div>
                {it.description != null && <div style={DESC_TYPE}>{it.description}</div>}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <ol aria-label={label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          const c = DOT[it.tone] || DOT.signal;
          const dt = machineTime(it);
          const timeStyle = { ...TIME_TYPE, marginBottom: 'var(--space-1)' };
          return (
            <li key={it.id != null ? it.id : i} style={{ display: 'flex', gap: 'var(--space-3-5)' }}>
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
                <div style={TITLE_TYPE}>{it.title}</div>
                {it.description != null && <div style={DESC_TYPE}>{it.description}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
