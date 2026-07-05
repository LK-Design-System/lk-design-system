import React from 'react';

// Connection strength by state — mirrors ConnectionBadge's mapping.
const CONN = {
  online: { c: 'var(--bw-green)', bars: 3 },
  reconnecting: { c: 'var(--bw-amber)', bars: 2 },
  offline: { c: 'var(--bw-gray-300)', bars: 0 },
};
const BAR_H = [5, 8, 12];

/**
 * LK ROBOTICS — RobotStatusCard
 * Live robot status card — thumbnail (or initials) + name on the left, and a
 * top-right status cluster: the operating-mode chip over a telemetry row
 * (connection-strength bars + a battery gauge that colours by level —
 * ≤20% red, ≤50% amber, else green). `selected` for the picked robot.
 */
export function RobotStatusCard({ name, image, status = 'online', battery, mode, selected = false, onClick, style, ...rest }) {
  const hasBat = typeof battery === 'number';
  const b = Math.max(0, Math.min(100, battery));
  const batC = b <= 20 ? 'var(--bw-red)' : (b <= 50 ? 'var(--bw-amber)' : 'var(--bw-green)');
  const conn = CONN[status] || CONN.offline;
  return (
    <div onClick={onClick} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16, width: '100%', boxSizing: 'border-box',
      background: 'var(--surface-raised)', border: `1px solid ${selected ? 'var(--lk-accent-ink)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-xl)', boxShadow: selected ? '0 0 0 3px var(--focus-ring)' : 'var(--shadow-sm)',
      cursor: onClick ? 'pointer' : 'default', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', flexShrink: 0, overflow: 'hidden',
        background: 'var(--fill-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {image ? <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--label-neutral)' }}>{String(name || '?').slice(0, 2)}</span>}
      </div>
      <span style={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 700, color: 'var(--label-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, flexShrink: 0 }}>
        {mode != null && <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0, padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'var(--lk-accent-tint)', color: 'var(--label-normal)', whiteSpace: 'nowrap' }}>{mode}</span>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span role="img" title={status} aria-label={status} style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, height: 12 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 3, height: BAR_H[i], borderRadius: 1, background: i < conn.bars ? conn.c : 'var(--fill-strong)' }} />
            ))}
          </span>
          {hasBat && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ position: 'relative', width: 24, height: 12, border: '1.5px solid var(--label-alternative)', borderRadius: 3, padding: 1.5, boxSizing: 'border-box' }}>
                <span style={{ display: 'block', height: '100%', width: `${b}%`, background: batC, borderRadius: 1 }} />
                <span style={{ position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)', width: 2, height: 5, background: 'var(--label-alternative)', borderRadius: '0 1px 1px 0' }} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: batC, fontVariantNumeric: 'tabular-nums' }}>{b}%</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
