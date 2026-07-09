import React from 'react';

/**
 * LK ROBOTICS — LogViewer
 * Monospace log / console stream. Lines are {time, level, source, text};
 * `level` (debug·info·warn·error) drives the accent. Optional level filter
 * chips, and `autoScroll` keeps the newest line in view as lines append — the
 * streaming complement to the static Code block.
 */
const LEVELS = {
  debug: { c: 'var(--color-semantic-label-assistive)', label: 'DEBUG' },
  info: { c: 'var(--color-semantic-primary-normal)', label: 'INFO' },
  warn: { c: 'var(--color-semantic-status-cautionary)', label: 'WARN' },
  error: { c: 'var(--color-semantic-status-negative)', label: 'ERROR' },
};
const ORDER = ['debug', 'info', 'warn', 'error'];

export function LogViewer({ lines = [], filter = true, autoScroll = true, height = 260, style, ...rest }) {
  const [active, setActive] = React.useState(() => new Set(ORDER));
  const boxRef = React.useRef(null);
  const shown = lines.filter((l) => active.has(l.level || 'info'));

  React.useEffect(() => {
    if (autoScroll && boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [lines.length, autoScroll]);

  const toggle = (lvl) => setActive((s) => { const n = new Set(s); n.has(lvl) ? n.delete(lvl) : n.add(lvl); return n; });

  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)', width: 'fit-content', maxWidth: '100%', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {filter && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ORDER.map((lvl) => {
            const on = active.has(lvl);
            return (
              <button key={lvl} type="button" onClick={() => toggle(lvl)} aria-pressed={on}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 24, padding: '0 9px', borderRadius: 'var(--radius-pill)', border: `1px solid ${on ? LEVELS[lvl].c : 'var(--bw-border)'}`, background: on ? 'var(--lk-accent-tint)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 'var(--fw-bold)', letterSpacing: 0.4, color: on ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-assistive)' }}>
                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: LEVELS[lvl].c }} />
                {LEVELS[lvl].label}
              </button>
            );
          })}
        </div>
      )}
      <div ref={boxRef} role="log" aria-live="polite" style={{ height, overflow: 'auto', padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-inverse-background)', border: '1px solid var(--color-semantic-line-normal-normal)', fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: 12, lineHeight: 1.6 }}>
        {shown.length === 0 && <div style={{ color: 'var(--inverse-label-assistive)' }}>로그 없음</div>}
        {shown.map((l, i) => {
          const cfg = LEVELS[l.level] || LEVELS.info;
          return (
            <div key={i} style={{ display: 'flex', gap: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {l.time != null && <span style={{ color: 'var(--inverse-label-assistive)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{l.time}</span>}
              <span style={{ color: cfg.c, fontWeight: 700, flexShrink: 0, width: 44 }}>{cfg.label}</span>
              {l.source != null && <span style={{ color: 'var(--inverse-label-alternative)', flexShrink: 0 }}>{l.source}</span>}
              <span style={{ color: 'var(--color-semantic-inverse-label)', flex: 1 }}>{l.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
