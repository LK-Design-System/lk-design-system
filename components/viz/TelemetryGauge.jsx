import React from 'react';

const TONE = { signal: 'var(--color-semantic-primary-normal)', positive: 'var(--color-semantic-status-positive)', cautionary: 'var(--color-semantic-status-cautionary)', negative: 'var(--color-semantic-status-negative)' };

/**
 * LK ROBOTICS — TelemetryGauge
 * A 270° radial gauge for telemetry (battery, speed, signal). Shows the value
 * + unit in the center; colour follows `tone` or percent `thresholds`
 * (≤low red, ≤high amber, else green).
 */
export function TelemetryGauge({ value = 0, min = 0, max = 100, unit = '', label, size = 120, thickness = 10, thresholds, tone, style, ...rest }) {
  const pct = Math.max(0, Math.min(1, (value - min) / ((max - min) || 1)));
  let c = 'var(--color-semantic-primary-normal)';
  if (tone) c = TONE[tone] || c;
  else if (thresholds) { const p = pct * 100; c = p <= thresholds.low ? 'var(--color-semantic-status-negative)' : (p <= thresholds.high ? 'var(--color-semantic-status-cautionary)' : 'var(--color-semantic-status-positive)'); }
  const r = (size - thickness) / 2, cx = size / 2, cy = size / 2, C = 2 * Math.PI * r, arc = 0.75, dash = C * arc;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(135deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-semantic-fill-strong)" strokeWidth={thickness} strokeLinecap="round" strokeDasharray={`${dash} ${C}`} />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={`${dash * pct} ${C}`} style={{ transition: 'stroke-dasharray var(--dur-slow) var(--ease-out), stroke var(--dur-base) var(--ease-out)' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size * 0.24, fontWeight: 'var(--fw-extra)', color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{Math.round(value)}</span>
          {unit && <span style={{ fontSize: size * 0.11, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-alternative)', marginTop: 2 }}>{unit}</span>}
        </div>
      </div>
      {label != null && <span style={{ fontSize: 12, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all', textAlign: 'center' }}>{label}</span>}
    </div>
  );
}
