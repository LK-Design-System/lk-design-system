import React from 'react';

/**
 * LK ROBOTICS — EmptyState
 * A centered placeholder for empty lists / no-results / errors. A muted icon in
 * a soft cyan tile, a bold title, a calm description and an optional action.
 */
export function EmptyState({ icon, title, description, action, style, ...rest }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        gap: 6, padding: '48px 24px', fontFamily: 'var(--font-sans)', maxWidth: 420, margin: '0 auto', ...style,
      }}
      {...rest}
    >
      {icon != null && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56,
          borderRadius: 'var(--radius-xl)', background: 'var(--lk-accent-tint)', color: 'var(--lk-accent-ink)', marginBottom: 12,
        }}>{icon}</div>
      )}
      {title != null && <div style={{ fontSize: 18, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.3px', color: 'var(--label-normal)' }}>{title}</div>}
      {description != null && <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--label-alternative)', wordBreak: 'keep-all' }}>{description}</div>}
      {action != null && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}
