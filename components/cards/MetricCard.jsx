import React from 'react';

/**
 * LK ROBOTICS — MetricCard
 * A KPI tile: an uppercase label, a big tabular value, an optional delta chip
 * (up = steel-positive, down = brick-red) and a caption. For dashboards / stat
 * bands.
 */
export function MetricCard({ label, value, delta, deltaTone = 'auto', caption, icon, style, ...rest }) {
  const tone = deltaTone === 'auto' ? (typeof delta === 'number' ? (delta >= 0 ? 'up' : 'down') : 'flat') : deltaTone;
  const up = tone === 'up';
  const dc = up ? 'var(--bw-green)' : tone === 'down' ? 'var(--bw-red)' : 'var(--label-alternative)';
  const deltaText = typeof delta === 'number' ? `${delta > 0 ? '+' : ''}${delta}%` : delta;
  return (
    <div style={{ background: 'var(--component-card-bg)', border: 'var(--component-card-border)', borderRadius: 'var(--component-card-radius)', padding: '22px 24px', boxShadow: 'var(--shadow-xs)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 'var(--fw-bold)', letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--label-alternative)' }}>{label}</span>
        {icon && <span style={{ color: 'var(--lk-accent-ink)', display: 'inline-flex' }}>{icon}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 34, fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: 'var(--label-normal)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {delta != null && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 'var(--fw-bold)', color: dc }}>
            {(tone === 'up' || tone === 'down') && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={up ? 'M7 17 17 7M9 7h8v8' : 'M7 7l10 10M17 9v8H9'} /></svg>}
            {deltaText}
          </span>
        )}
      </div>
      {caption != null && <div style={{ marginTop: 8, fontSize: 13, color: 'var(--label-alternative)' }}>{caption}</div>}
    </div>
  );
}
