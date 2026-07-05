import React from 'react';

/**
 * LK ROBOTICS — Avatar
 * Round photo with optional status dot; falls back to initials on a cool-gray
 * tint. `ring` adds a white halo for stacking on imagery.
 */
export function Avatar({
  src,
  alt = '',
  name,
  size = 48,
  status,
  ring = false,
  style,
  ...rest
}) {
  const initials = name ? name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() : '';
  const statusColor = status === 'online' ? 'var(--lk-accent-ink)' : status === 'busy' ? 'var(--bw-red)' : 'var(--bw-gray-300)';
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, ...style }} {...rest}>
      {src ? (
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          style={{ width: size, height: size, objectFit: 'cover', borderRadius: 'var(--radius-pill)', boxShadow: ring ? '0 0 0 4px var(--bw-white), 0 0 0 5px var(--bw-border)' : 'none' }}
        />
      ) : (
        <span style={{
          width: size, height: size, borderRadius: 'var(--radius-pill)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bw-indigo-tint)', color: 'var(--bw-ink)',
          fontFamily: 'var(--font-sans)', fontWeight: 'var(--fw-bold)', fontSize: Math.round(size * 0.38),
        }}>
          {initials}
        </span>
      )}
      {status && (
        <span style={{
          position: 'absolute', right: 0, bottom: 0,
          width: Math.max(10, size * 0.24), height: Math.max(10, size * 0.24),
          background: statusColor, borderRadius: '50%', border: '2px solid var(--bw-white)',
        }} />
      )}
    </span>
  );
}
