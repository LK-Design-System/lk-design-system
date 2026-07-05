import React from 'react';

/**
 * LK ROBOTICS — AvatarGroup
 * Overlapping avatars with a white ring; collapses past `max` into a navy
 * "+N" chip. Pass `items` as `{ src, name }` — a photo, else the name's first
 * letter on a soft cyan tile.
 */
export function AvatarGroup({ items = [], max = 4, size = 36, style, ...rest }) {
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  const overlap = -Math.round(size * 0.3);
  const base = {
    width: size, height: size, borderRadius: '50%', border: '2px solid var(--bw-white)', boxSizing: 'border-box',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
    fontFamily: 'var(--font-sans)', fontSize: Math.round(size * 0.36), fontWeight: 'var(--fw-bold)',
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', ...style }} {...rest}>
      {shown.map((it, i) => (
        <span key={i} title={it.name} style={{ ...base, marginLeft: i ? overlap : 0, background: it.src ? 'var(--bw-mist)' : 'var(--lk-accent-tint-2)', color: 'var(--lk-accent-ink)', zIndex: i }}>
          {it.src ? <img src={it.src} alt={it.name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (it.name ? String(it.name).slice(0, 1) : '')}
        </span>
      ))}
      {extra > 0 && <span style={{ ...base, marginLeft: overlap, background: 'var(--surface-inverse)', color: 'var(--text-on-inverse)', zIndex: shown.length }}>+{extra}</span>}
    </div>
  );
}
