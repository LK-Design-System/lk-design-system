import React from 'react';

function statusColor(tone) {
  if (tone === 'danger') return 'var(--color-semantic-status-negative)';
  if (tone === 'warning') return 'var(--color-semantic-status-cautionary)';
  if (tone === 'positive') return 'var(--color-semantic-status-positive)';
  if (tone === 'signal') return 'var(--color-semantic-primary-normal)';
  return 'var(--color-semantic-label-strong)';
}

/**
 * LK ROBOTICS — ViewportStatusBar
 * Dense readout row for 2D map and 3D point-cloud editors: mode, cursor pose,
 * zoom/camera, selected objects, snap state, point count, FPS, or stale status.
 */
export function ViewportStatusBar({ items = [], children, style, ...rest }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 0,
        width: '100%',
        flexWrap: 'wrap',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true" style={{ width: 1, height: 14, background: 'var(--color-semantic-line-normal-normal)' }} />}
          <span
            title={item.title}
            style={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 4,
              minWidth: 0,
              color: 'var(--color-semantic-label-alternative)',
              fontSize: 'var(--caption1-size)',
              lineHeight: 'var(--caption1-line)',
              fontWeight: 'var(--fw-medium)',
              letterSpacing: 0,
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
            <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: statusColor(item.tone), fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums', fontFamily: item.mono ? 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)' : 'inherit' }}>
              {item.value}
            </strong>
            {item.unit != null && <span style={{ whiteSpace: 'nowrap' }}>{item.unit}</span>}
          </span>
        </React.Fragment>
      ))}
      {children != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>{children}</span>}
    </div>
  );
}
