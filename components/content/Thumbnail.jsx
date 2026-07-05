import React from 'react';

const toLen = (v) => (typeof v === 'number' ? v + 'px' : v);

const ALIGN = {
  'top-left': { top: 8, left: 8 },
  'top-right': { top: 8, right: 8 },
  'bottom-left': { bottom: 8, left: 8 },
  'bottom-right': { bottom: 8, right: 8 },
};

/**
 * LK ROBOTICS — Thumbnail
 * A fixed-ratio media tile — image cropped to `ratio` with
 * optional rounded corners and an overlay slot for a badge, play glyph, or
 * duration. Use in cards, lists, galleries. Falls back to a neutral fill when
 * no `src` is given (placeholder).
 */
export function Thumbnail({
  src,
  alt = '',
  ratio = 1,
  radius = true,
  fit = 'cover',
  overlay,
  overlayAlign = 'top-left',
  style,
  children,
  ...rest
}) {
  const r = radius === true ? 'var(--radius-md)' : radius === false ? '0' : toLen(radius);
  const pos = ALIGN[overlayAlign] || ALIGN['top-left'];
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: String(ratio),
        overflow: 'hidden',
        borderRadius: r,
        background: 'var(--fill-normal)',
        ...style,
      }}
      {...rest}
    >
      {src && <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />}
      {(overlay || children) && (
        <div style={{ position: 'absolute', display: 'flex', gap: 6, ...pos }}>
          {overlay}
          {children}
        </div>
      )}
    </div>
  );
}
