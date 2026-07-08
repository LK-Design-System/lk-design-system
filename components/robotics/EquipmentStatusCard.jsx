import React from 'react';
import { ConnectionBadge } from './ConnectionBadge';

// Tone drives non-text marks only (direction arrow + status dot); the ringLabel
// text stays on --color-semantic-label-neutral, so these carry the semantic hue, not AA-text duty.
const TONE = {
  positive: 'var(--color-semantic-status-positive)',
  cautionary: 'var(--color-semantic-status-cautionary)',
  negative: 'var(--color-semantic-status-negative)',
  signal: 'var(--color-semantic-primary-normal)',
  neutral: 'var(--color-semantic-label-alternative)',
};

function useDimKeyframes() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-equip-dim-kf')) return;
    const el = document.createElement('style');
    el.id = 'lk-equip-dim-kf';
    el.textContent = '@keyframes lk-equip-dim{0%,100%{opacity:1}50%{opacity:.4}}';
    document.head.appendChild(el);
  }, []);
}

/**
 * LK ROBOTICS — EquipmentStatusCard
 * A facility-equipment status card (door / elevator / stair lift) in the LK
 * ledger idiom — a horizontal row that rhymes with RobotStatusCard: leading
 * icon tile + title on the left, its status conditions as a muted text sub-line
 * underneath, and the headline state on the right as a small tone dot + readable
 * ink label (--color-semantic-label-neutral, WCAG-AA). A moving item swaps the dot for a dim
 * direction arrow so the signal is carried once, not twice; a comms state
 * (`connection`) swaps it for ConnectionBadge signal bars — the system's shared
 * connectivity vocabulary. `icon` takes any node.
 */
export function EquipmentStatusCard({ icon, title, ringLabel, ringCaption, tone = 'neutral', direction, connection, chips, style, ...rest }) {
  useDimKeyframes();
  const c = TONE[tone] || TONE.neutral;
  const moving = direction != null;
  const hasChips = chips && chips.length > 0;
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%', boxSizing: 'border-box',
        padding: '14px 16px', background: 'var(--color-semantic-background-elevated-normal)', border: 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)', boxShadow: 'var(--component-card-shadow-sm)', fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {icon != null && (
        <span style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', flexShrink: 0, background: 'var(--color-semantic-fill-strong)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-semantic-label-alternative)' }}>
          {icon}
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {title != null && (
          <div style={{ fontSize: 15, fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
        )}
        {(hasChips || ringCaption != null) && (
          <div style={{ marginTop: 3, fontSize: 12, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-alternative)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {hasChips ? chips.map((ch) => ch.label).join(' · ') : ringCaption}
          </div>
        )}
      </div>

      {ringLabel != null && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap',
          fontSize: 13, fontWeight: 'var(--fw-semibold)', letterSpacing: 0, color: 'var(--color-semantic-label-neutral)', fontVariantNumeric: 'tabular-nums' }}>
          {moving ? (
            <span aria-label={direction === 'up' ? '상승 중' : '하강 중'} style={{ display: 'inline-flex', color: c, animation: 'lk-equip-dim 1.5s var(--ease-in-out) infinite' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                {direction === 'up' ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}
              </svg>
            </span>
          ) : connection != null ? (
            <ConnectionBadge status={connection} showLabel={false} size="sm" style={{ flexShrink: 0 }} />
          ) : (
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
          )}
          {ringLabel}
        </span>
      )}
    </div>
  );
}
