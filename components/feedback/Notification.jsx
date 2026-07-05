import React from 'react';

/**
 * LK ROBOTICS — Notification
 * A notification row: an icon tile, a bold title, description, time and an
 * `unread` state (soft cyan wash + red dot). Set `onClick` for an actionable
 * row.
 */
export function Notification({ icon, title, description, time, unread = false, onClick, style, ...rest }) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 'var(--radius-lg)', cursor: onClick ? 'pointer' : 'default', background: unread ? 'var(--lk-accent-tint)' : 'transparent', fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {icon != null && <span style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--bw-white)', border: '1px solid var(--bw-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lk-accent-ink)' }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14.5, fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--label-normal)' }}>{title}</span>
          {unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bw-red)', flexShrink: 0 }} />}
        </div>
        {description != null && <div style={{ marginTop: 2, fontSize: 13, lineHeight: 1.55, color: 'var(--label-alternative)', wordBreak: 'keep-all' }}>{description}</div>}
        {time != null && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--label-assistive)' }}>{time}</div>}
      </div>
    </div>
  );
}
